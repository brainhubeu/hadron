import isGrantedProvider, {
  fillMissingRoles,
  checkRole,
  checkRoles,
  getDeeperRoles,
  excludeRoles,
} from '../hierarchyProvider';
import { expect } from 'chai';

describe('hierarchyProvider', () => {
  const basicHierarchy = {
    ADMIN: ['USER', 'MANAGER'],
    MANAGER: ['USER'],
    GUEST: [],
  };

  describe('fillMissingRoles', () => {
    it('should add missing roles from hierarchy', () => {
      const roles = {
        ROLE1: ['ROLE2', 'ROLE3'],
        ROLE2: ['ROLE4'],
      };
      expect(fillMissingRoles(roles)).to.contain.keys([
        'ROLE1',
        'ROLE2',
        'ROLE3',
        'ROLE4',
      ]);
    });

    it('should keep hierarchy of previously mentioned role', () => {
      const roles = {
        ROLE1: ['ROLE2', 'ROLE3'],
        ROLE2: ['ROLE4'],
      };
      expect(fillMissingRoles(roles).ROLE2).to.eql(['ROLE4']);
    });
  });

  describe('checkRole', () => {
    it('should return true if role is exactly the same as requested', () =>
      expect(checkRole(['ADMIN'], 'ADMIN', basicHierarchy)).to.be.eql(true));

    it('should return false if role is not exactly the same and does not contain it in hierarchy', () =>
      expect(checkRole(['USER'], 'MANAGER', basicHierarchy)).to.be.eql(false));

    it('should return true if role is not exactly the same but does contain it in hierarchy', () =>
      expect(checkRole(['MANAGER'], 'USER', basicHierarchy)).to.be.eql(true));

    it('should return true if one of roles is matching', () =>
      expect(
        checkRole(['MANAGER', 'USER'], 'MANAGER', basicHierarchy),
      ).to.be.eql(true));

    it('should return false if none of roles is matching', () =>
      expect(checkRole(['MANAGER', 'USER'], 'ADMIN', basicHierarchy)).to.be.eql(
        false,
      ));

    it('should return true if role is in hierarchy of user roles', () =>
      expect(checkRole(['ADMIN', 'USER'], 'MANAGER', basicHierarchy)).to.be.eql(
        true,
      ));

    it('should return true if role is in deeper hierarchy of user roles', () => {
      const roles = {
        ...basicHierarchy,
        MANAGER: ['TESTUSER', 'USER'],
      };
      return expect(checkRole(['ADMIN'], 'TESTUSER', roles)).to.be.eql(true);
    });

    it('should handle recurrent hierarchy', () => {
      const roles = {
        ADMIN: ['MANAGER'],
        MANAGER: ['ADMIN'],
      };
      return expect(checkRole(['ADMIN'], 'TESTUSER', roles)).to.be.eql(false);
    });

    it("should return false, if role doesn't exists", () =>
      expect(checkRole(['ADMIN'], 'UNEXISTING_ROLE', basicHierarchy)).to.be.eql(
        false,
      ));
  });

  describe('checkRoles', () => {
    it('should return true if role is one of given', () =>
      expect(
        checkRoles(['MANAGER'], ['MANAGER', 'ADMIN'], basicHierarchy),
      ).to.be.eql(true));

    it('should return false, if none of roles is matching given one', () =>
      expect(
        checkRoles(['USER'], ['MANAGER', 'ADMIN'], basicHierarchy),
      ).to.be.eql(false));

    it('should return true if user has both roles', () =>
      expect(
        checkRoles(
          ['MANAGER', 'ADMIN'],
          ['MANAGER', 'ADMIN'],
          basicHierarchy,
          true,
        ),
      ).to.be.eql(true));

    it("should return false if user doesn't have one of roles", () =>
      expect(
        checkRoles(['MANAGER'], ['MANAGER', 'ADMIN'], basicHierarchy, true),
      ).to.be.eql(false));

    it('should return true if role contains both required roles', () =>
      expect(
        checkRoles(['ADMIN'], ['MANAGER', 'USER'], basicHierarchy, true),
      ).to.be.eql(true));
  });

  describe('getDeeperRoles', () => {
    it('should return roles that are related to given one', () =>
      expect(getDeeperRoles(['ADMIN'], basicHierarchy)).to.has.members([
        'MANAGER',
        'USER',
      ]));

    it('should return roles that are related to all given roles', () => {
      const hierarchy = {
        ROLE1: ['ROLE2', 'ROLE3'],
        ROLE4: ['ROLE5'],
      };

      return expect(
        getDeeperRoles(['ROLE1', 'ROLE4'], hierarchy),
      ).to.has.members(['ROLE2', 'ROLE3', 'ROLE5']);
    });

    it('should return roles that are related to all given roles distinctly', () => {
      const hierarchy = {
        ROLE1: ['ROLE2', 'ROLE3'],
        ROLE4: ['ROLE5', 'ROLE3'],
      };

      return expect(
        getDeeperRoles(['ROLE1', 'ROLE4'], hierarchy),
      ).to.has.members(['ROLE2', 'ROLE3', 'ROLE5']);
    });
  });

  describe('excludeRoles', () => {
    it('should remove given role from list', () =>
      expect(excludeRoles(['ADMIN'], basicHierarchy)).to.contain.keys([
        'MANAGER',
        'GUEST',
      ]));

    it('should remove given roles from list', () =>
      expect(
        excludeRoles(['ADMIN', 'MANAGER'], basicHierarchy),
      ).to.contain.keys(['GUEST']));
  });

  describe('isGranted', () => {
    const isGranted = isGrantedProvider(basicHierarchy);

    it('should pass if single matching role has been provided', () => {
      const user = { username: 'George', roles: ['ADMIN'] };
      return expect(isGranted(user, 'ADMIN')).to.be.eql(true);
    });

    it('should fail if single not matching role has been provided', () => {
      const user = { username: 'George', roles: ['ADMIN'] };
      return expect(isGranted(user, 'GUEST')).to.be.eql(false);
    });

    it('should pass if array of roles has been provided, with single matching one', () => {
      const user = { username: 'George', roles: ['ADMIN'] };
      return expect(isGranted(user, ['ADMIN', 'GUEST'])).to.be.eql(true);
    });

    it('should fail if array of roles has been provided, with none that matches', () => {
      const user = { username: 'George', roles: ['MANAGER'] };
      return expect(isGranted(user, ['ADMIN', 'GUEST'])).to.be.eql(false);
    });

    it('should pass if array of arrays of roles has been provided and all of them are matching', () => {
      const user = { username: 'George', roles: ['ADMIN', 'GUEST'] };
      return expect(isGranted(user, [['ADMIN', 'GUEST']])).to.be.eql(true);
    });

    it('should fail if array of arrays of roles has been provided and one of them is not matching', () => {
      const user = { username: 'George', roles: ['ADMIN'] };
      return expect(isGranted(user, [['ADMIN', 'GUEST']])).to.be.eql(false);
    });

    it('should pass if array of arrays and single role has been provided and one of them are matching', () => {
      const user = { username: 'George', roles: ['MANAGER'] };
      return expect(isGranted(user, [['ADMIN', 'GUEST'], 'MANAGER'])).to.be.eql(
        true,
      );
    });

    it('should fail if array of arrays of roles has been provided and none of them are matching', () => {
      const user = { username: 'George', roles: ['MANAGER'] };
      return expect(
        isGranted(user, [['ADMIN', 'GUEST'], ['MANAGER', 'GUEST']]),
      ).to.be.eql(false);
    });

    it('should pass if array of arrays of roles has been provided and one of them are matching', () => {
      const user = { username: 'George', roles: ['MANAGER', 'GUEST'] };
      return expect(
        isGranted(user, [['ADMIN', 'GUEST'], ['MANAGER', 'GUEST']]),
      ).to.be.eql(true);
    });
  });
});
