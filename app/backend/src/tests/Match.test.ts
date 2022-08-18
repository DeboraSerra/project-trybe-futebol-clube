import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import * as Sinon from 'sinon';
import { app } from '../app';
import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';
import { IMatchComplete } from '../interfaces';
import { getAllMatchMock, getAllTeamMock, inProgressMock, notInProgressMock } from './mocks/Matches';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test match route', () => {
  describe('GET /matches', () => {
    it('should return all the matches', async () => {
      const response = await chai.request(app)
        .get('/matches')
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
    });
    it('should have the team names', async () => {
      const response = await chai.request(app)
        .get('/matches')
      response.body.forEach((match: IMatchComplete) => {
        const { teamHome, teamAway } = match;
        expect(teamHome).to.have.property('teamName');
        expect(teamAway).to.have.property('teamName');
      })
    })
  })
  describe('GET /matches?inProgress', () => {
    it('should return only matches in progress if the query is true', async () => {
      const response = await chai.request(app)
        .get('/matches?inProgress=true')
      expect(response).to.have.status(200);
      response.body.forEach((match: IMatchComplete) => {
        const { inProgress } = match;
        expect(inProgress).to.be.true;
      })
    })
    it('should return only finished matches if the query is false', async () => {
      const response = await chai.request(app)
        .get('/matches?inProgress=false')
      expect(response).to.have.status(200);
      response.body.forEach((match: IMatchComplete) => {
        const { inProgress } = match;
        expect(inProgress).to.be.false;
      })
    })
  })
  describe('POST /matches', () => {
    it('shouldn\'t be possible to create a match without a token', async () => {
      const response = await chai.request(app)
        .post('/matches')
        .send({
          "homeTeam": 16,
          "awayTeam": 8,
          "homeTeamGoals": 2,
          "awayTeamGoals": 2
        })
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'Token must be a valid token');
    });
    it('should not be possible to create a match if the home and away teams are the same', async () => {
      const response = await chai.request(app)
        .post('/matches')
        .send({
          "homeTeam": 8,
          "awayTeam": 8,
          "homeTeamGoals": 2,
          "awayTeamGoals": 2
        })
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'It is not possible to create a match with two equal teams');
    });
    it('should not be possible to create a match if the one of the teams doesn\'t exist', async () => {
      const response = await chai.request(app)
        .post('/matches')
        .send({
          "homeTeam": 20,
          "awayTeam": 8,
          "homeTeamGoals": 2,
          "awayTeamGoals": 2
        })
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'There is no team with such id!');
    });
  })
  describe('PATCH /matches/:id/finish', () => {
    it('should update the inProgress key and return finished', async () => {
      const response = await chai.request(app)
        .get('/matches?inProgress=true')
      const id = response[0].id;
      const res = await chai.request(app)
        .patch(`/matches/${id}/finish`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Finished');
      const match = await chai.request(app)
      .get('/matches?inProgress=true')
      expect(match.body[0].id).not.to.be.equal(id);
    })
  })
})
