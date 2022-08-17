import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import * as Sinon from 'sinon';
import { app } from '../app';
import Team from '../database/models/Team.model';
import Teams from './mocks/Teams';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test the teams route', async () => {
  beforeEach(() => {
    Sinon.restore();
  })
  describe('GET /teams', () => {
    it('returns all the teams', async () => {
      Sinon.stub(Team, 'findAll').resolves(Teams as Team[]);
      const response = await chai.request(app)
        .get('/teams')
      expect(response).to.have.status(200);
      expect(response.body).to.have.length(3);
    })
  })
  describe('GET /teams/:id', () => {
    it('returns the right team name', async () => {
      Sinon.stub(Team, 'findOne').resolves({ id: 1, teamName: 'Palmeiras' } as Team);
      const response = await chai.request(app)
        .get('/teams/1')
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('name', 'Palmeiras');
      expect(response.body).to.have.property('id', 1);
    });
  });
})
