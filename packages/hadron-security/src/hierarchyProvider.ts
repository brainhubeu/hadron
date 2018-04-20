export interface IUser {
  username: string;
  roles: string[];
}

export interface IRolesMap {
  [s: string]: string[];
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
 * @param allRoles
 * @returns {string[]}
 */
export function getDeeperRoles(userRoles: string[], allRoles: IRolesMap) {
  return userRoles
    .filter((role: string) => !!allRoles[role])
    .reduce(
      (accumulator: string[], role: string) => [
        ...accumulator,
        ...allRoles[role].filter(
          (roleToAdd) => !accumulator.includes(roleToAdd),
        ),
      ],
      [],
    );
}

/**
 * Returns array of all given roles, without ones given in first parameter
 * @param userRoles
 * @param allRoles
 * @returns {string[]}
 */
export function excludeRoles(userRoles: string[], allRoles: IRolesMap) {
  return Object.entries(allRoles)
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
 * @param allRoles
 * @returns {boolean}
 */
export function checkRole(
  userRoles: string[],
  requiredRole: string,
  allRoles: IRolesMap,
): boolean {
  if (userRoles.length <= 0) {
    return false;
  }

  if (userRoles.indexOf(requiredRole) >= 0) {
    return true;
  }

  return checkRole(
    getDeeperRoles(userRoles, allRoles),
    requiredRole,
    // excludes currently checked roles to avoid endless recurrency
    excludeRoles(userRoles, allRoles),
  );
}

/**
 * Checks list of roles
 *
 * @param userRoles
 * @param requiredRoles
 * @param allRoles
 * @param exact specifies if user needs all roles from requiredRoles (true), or only one of them (false)
 * @return {boolean}
 */
export function checkRoles(
  userRoles: string[],
  requiredRoles: string[],
  allRoles: IRolesMap,
  exact = false,
): boolean {
  if (userRoles.length <= 0) {
    return false;
  }

  return requiredRoles
    .map(
      (role) =>
        typeof role === 'object'
          ? checkRoles(userRoles, role, allRoles, true)
          : checkRole(userRoles, role, allRoles),
    )
    .reduce(
      (accumulator, currentValue) =>
        exact ? accumulator && currentValue : accumulator || currentValue,
    );
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
  return function isGranted(user: IUser, roles: any): boolean {
    if (typeof roles === 'string') {
      return checkRole(user.roles, roles, fullRoles);
    }

    if (typeof roles === 'object') {
      return checkRoles(user.roles, roles, fullRoles);
    }

    throw new Error('Unknown role type');
  };
}
