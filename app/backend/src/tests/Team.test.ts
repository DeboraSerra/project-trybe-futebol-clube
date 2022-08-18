import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import * as Sinon from 'sinon';
import { app } from '../app';
import Team from '../database/models/Team.model';
import { ITeam } from '../interfaces';
import TeamsMock from './mocks/Teams';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test the teams route', async () => {
  let team1: ITeam;
  describe('GET /teams', () => {
    afterEach(Sinon.restore);
    it('returns all the teams', async () => {
      Sinon.stub(Team, 'findAll').resolves(TeamsMock as unknown as Team[]);
      const response = await chai.request(app)
        .get('/teams');
      team1 = response.body[0];
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
    })
  })
  describe('GET /teams/:id', () => {
    afterEach(Sinon.restore);
    it('should not be possible to access a team that does not exists', async () => {
      Sinon.stub(Team, 'findOne').resolves(undefined);
      const response = await chai.request(app)
        .get('/teams/20')
      expect(response).to.have.status(404);
      expect(response.body).to.have.property('message', 'Team not found');
    });
    it('returns the right team name', async () => {
      Sinon.stub(Team, 'findOne').resolves(TeamsMock[0] as unknown as Team);
      const response = await chai.request(app)
        .get('/teams/1')
      expect(response).to.have.status(200);
      expect(response.body).to.be.deep.equal(team1);
    });
  });
})
