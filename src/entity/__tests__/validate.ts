import { expect } from "chai";
import { Team } from "../Team";
import { User } from "../User";
import validate from "../validation/validate";

describe ("Validate", () => {
    it ("should pass valid email", () => {
        const validEmail = {
            html: "abc",
            text: "abc",
        };

        return validate("email", validEmail).then((data) => {
            expect(data).to.be.deep.equal(validEmail);
        });
    });

    it ("should return error if email is invalid", () => {
        const invalidEmail = {
            html: "abc",
            text: 1,
        };

        return validate("email", invalidEmail).catch((error) => {
            expect(error).to.be.an.instanceof(Error);
        });
    });

    it ("should pass valid user", () => {
        const team = new Team();
        team.id = 1;
        team.name = "Team One";

        const user = new User();
        user.id = 1;
        user.name = "Max";
        user.team = team;

        return validate("user", user).then((data) => {
            expect(data).to.be.deep.equal(user);
        });
    });

    it ("should return error if user team is null", () => {
        const user = new User();
        user.id = 1;
        user.name = "Max";
        user.team = null;

        return validate("user", user).catch((error) => {
            expect(error).to.be.an.instanceof(Error);
        });
    });

    it ("should check if users in team are User objects", () => {
        const dummyArr = [null, new User()];
        const team = new Team();
        team.id = 1;
        team.name = "Team";
        team.users = dummyArr;

        return validate("team", team).catch((error) => {
            expect(error).to.be.an.instanceof(Error);
        });
    });
});
