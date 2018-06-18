export interface IRolesMap {
  [s: string]: string[];
}

export interface IRole {
  id: number | string;
  name: string;
}

export interface IUser {
  id: number | string;
  username: string;
  passwordHash: string;
  roles: IRole[];
}

/**
 * Function adds roles from dependency of other roles, to make sure that all roles are available
 * @param roles available roles with all "dependent" ones
 * @returns {IRolesMap}
 */
export function fillMissingRoles(roles: IRolesMap | string[]): IRolesMap {
  if (roles instanceof Array) {
    return roles.reduce(
      (accumulator: IRolesMap, role: string) => ({
        ...accumulator,
        [role]: [],
      }),
      {},
    );
  }
  return Object.entries(roles).reduce(
    (accumulator: IRolesMap, [key, value]: [string, string[]]) => {
      accumulator[key] = value;
      value.forEach((role: string) => {
        if (!accumulator[role]) {
          accumulator[role] = [];
        }
      });
      return accumulator;
    },
    {} as IRolesMap,
  );
}

/**
 * Get array of all roles below in hierarchy distinctly
 * @param userRoles
 * @param availableRoles
 * @returns {string[]}
 */
export function getDeeperRoles(userRoles: string[], availableRoles: IRolesMap) {
  return userRoles
    .filter((role: string) => !!availableRoles[role])
    .reduce(
      (accumulator: string[], role: string) => [
        ...accumulator,
        ...availableRoles[role].filter(
          (roleToAdd) => !accumulator.includes(roleToAdd),
        ),
      ],
      [],
    );
}

/**
 * Returns array of all given roles, without ones given in first parameter
 * @param userRoles
 * @param availableRoles
 * @returns {string[]}
 */
export function excludeRoles(userRoles: string[], availableRoles: IRolesMap) {
  return Object.entries(availableRoles)
    .filter(([key, value]: [string, any]) => userRoles.indexOf(key) < 0)
    .reduce(
      (accumulator: object, [key, value]: [string, any]) => ({
        ...accumulator,
        [key]: value,
      }),
      {},
    );
}

/**
 * Checks if user role contains required role
 * @param userRoles
 * @param requiredRole
 * @param availableRoles
 * @returns {boolean}
 */
export function checkRole(
  userRoles: string[],
  requiredRole: string,
  availableRoles: IRolesMap,
): boolean {
  if (userRoles.length <= 0) {
    return false;
  }

  if (userRoles.indexOf(requiredRole) >= 0) {
    return true;
  }

  return checkRole(
    getDeeperRoles(userRoles, availableRoles),
    requiredRole,
    // excludes currently checked roles to avoid endless recurrency
    excludeRoles(userRoles, availableRoles),
  );
}

/**
 * Checks list of roles
 *
 * @param userRoles
 * @param requiredRoles
 * @param availableRoles
 * @param exact specifies if user needs all roles from requiredRoles (true), or only one of them (false)
 * @return {boolean}
 */
export function checkRoles(
  userRoles: string[],
  requiredRoles: string[],
  availableRoles: IRolesMap,
  exact = false,
): boolean {
  if (userRoles.length <= 0) {
    return false;
  }

  return requiredRoles
    .map(
      (role) =>
        typeof role === 'object'
          ? checkRoles(userRoles, role, availableRoles, true)
          : checkRole(userRoles, role, availableRoles),
    )
    .reduce(
      (accumulator, currentValue) =>
        exact ? accumulator && currentValue : accumulator || currentValue,
    );
}

/**
 * Returns true if given roles are matching expected roles in hierarchy
 * @param {IUser} user
 * @param roles
 * @param allRoles
 * @returns {boolean}
 */
export function isGranted(
  userRoles: string[],
  roles: any,
  allRoles: IRolesMap,
): boolean {
  if (typeof roles === 'string') {
    return checkRole(userRoles, roles, allRoles);
  }

  if (typeof roles === 'object') {
    return checkRoles(userRoles, roles, allRoles);
  }

  throw new Error('Unknown role type');
}

/**
 * Returns true if user has matching role in hierarchy
 * @param {IUser} user
 * @param roles
 * @param allRoles
 * @returns {boolean}
 */
export function isUserGranted(
  user: IUser,
  roles: any,
  allRoles: IRolesMap,
): boolean {
  return isGranted(user.roles.map((role) => role.name), roles, allRoles);
}

/**
 * Provider for hierarchy manager
 * @param rolesHierarchy
 * @returns {function<boolean>}
 */
export default function hierarchyProvider(
  rolesHierarchy: IRolesMap | string[],
) {
  const fullRoles: IRolesMap = fillMissingRoles(rolesHierarchy);
  return {
    isGranted: (userRoles: string[], roles: any) =>
      isGranted(userRoles, roles, fullRoles),
    isUserGranted: (user: IUser, roles: any) =>
      isUserGranted(user, roles, fullRoles),
  };
}
