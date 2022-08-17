import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import * as Sinon from 'sinon';
import { app } from '../app';
import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';
import { getAllMatchMock, getAllTeamMock, inProgressMock, notInProgressMock } from './mocks/Matches';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test match route', () => {
  describe('GET /matches', () => {
    it('should return all the matches', async () => {
      Sinon.stub(Match, 'findAll').resolves(getAllMatchMock as Match[]);
      Sinon.stub(Team, 'findOne');
      const response = await chai.request(app)
        .get('/matches')
      expect(response).to.have.status(200);
      expect(response).to.have.length(3);
    })
  })
  describe('GET /matches?inProgress', () => {
    beforeEach(Sinon.restore);
    it('should return only matches in progress if the query is true', async () => {
      Sinon.stub(Match, 'findAll').resolves(inProgressMock as unknown as Match[]);
      Sinon.stub(Team, 'findOne');
      const response = await chai.request()
    })
  })
})
