import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import * as Sinon from 'sinon';
import { app } from '../app';
import Team from '../database/models/Team.model';
import { ITeam } from '../interfaces';
import Teams from './mocks/Teams';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test the teams route', async () => {
  let team1: ITeam;
  describe('GET /teams', () => {
    it('returns all the teams', async () => {
      const response = await chai.request(app)
        .get('/teams');
      team1 = response.body[0];
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
    })
  })
  describe('GET /teams/:id', () => {
    it('should not be possible to access a team that does not exists', async () => {
      const response = await chai.request(app)
        .get('/teams/20')
      expect(response).to.have.status(404);
      expect(response.body).to.have.property('message', 'Team not found');
    });
    it('returns the right team name', async () => {
      const response = await chai.request(app)
        .get('/teams/1')
      expect(response).to.have.status(200);
      expect(response.body).to.be.deep.equal(team1);
    });
  });
})
