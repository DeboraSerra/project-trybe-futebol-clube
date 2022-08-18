import * as Sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import { app } from '../app';
import Match from '../database/models/Match.model';
import MatchesMock from './mocks/Matches';
import TeamMock from './mocks/Teams';
import Team from '../database/models/Team.model';

chai.use(chaiHttp);

const { expect } = chai;

describe('Tests the leader board routes', async () => {
  let obj = {
    email: 'user@user.com',
    password: 'secret_user',
  };
  const token = await chai.request(app)
    .post('/login')
    .send(obj)
    .then((res) => res.body.token);
  describe('GET /leaderboard', () => {
    const expected = {
      "totalVictories": 15,
      "totalPoints": 55,
      "totalLosses": 15,
      "totalGames": 40,
      "totalDraws": 10,
      "goalsFavor": 52,
      "goalsOwn": 57,
      "goalsBalance": -5,
      "efficiency": 45.83,
      "name": "Avaí/Kindermann"
    };
    afterEach(Sinon.restore);
    it('should return a list with the classifications', async () => {
      const response = await chai.request(app)
        .get('/leaderboard');
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.be.deep.equal(expected);
    })
  });
  describe('GET /leaderboard/home', () => {
    const expected = {
      "totalVictories": 3,
      "totalPoints": 9,
      "totalLosses": 0,
      "totalGames": 3,
      "totalDraws": 0,
      "goalsFavor": 9,
      "goalsOwn": 3,
      "goalsBalance": 6,
      "efficiency": 100,
      "name": "Santos"
    };
    afterEach(Sinon.restore);
    it('should return a list with the classifications', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/home');
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.be.deep.equal(expected);
    })
  });
  describe('GET /leaderboard/away', () => {
    const expected = {
      "totalVictories": 2,
      "totalPoints": 6,
      "totalLosses": 0,
      "totalGames": 2,
      "totalDraws": 0,
      "goalsFavor": 7,
      "goalsOwn": 0,
      "goalsBalance": 7,
      "efficiency": 100,
      "name": "Palmeiras"
    };
    afterEach(Sinon.restore);
    it('should return a list with the classifications', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/away');
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.be.deep.equal(expected);
    })
    it('should update the info if a match is added', async () => {
      const match = {
        homeTeam: 12,
        homeTeamGoals: 0,
        awayTeam: 4,
        awayTeamGoals: 3,
      }
      const id = await chai.request(app)
        .post('/matches')
        .auth(token, { type: 'bearer' })
        .send(match)
        .then((res) => res.body.id);
      await chai.request(app)
        .patch(`/matches/${id}/finish`);
      const response = await chai.request(app)
        .get('/leaderboard/away')
      expect(response).to.have.status(200);
      expect(response.body[0]).not.to.be.deep.equal(expected);
    });
  });
})
