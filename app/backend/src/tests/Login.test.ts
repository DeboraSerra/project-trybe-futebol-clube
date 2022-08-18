import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { describe } from 'mocha';
import { app } from '../app';
import User from '../database/models/User.model';
import UserMock from './mocks/Users';

chai.use(chaiHttp);

const { expect } = chai;

const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('Test the login route', () => {
  describe('POST /login', () => {
    let obj = {
      email: 'user@user.com',
      password: 'secret_user',
    };
    beforeEach(() => {
      obj = {
        email: 'user@user.com',
        password: 'secret_user',
      }
    })
    afterEach(sinon.restore);
    it('returns an error if no email is passed', async () => {
      sinon.stub(User, 'findOne').resolves();
      obj.email = '';
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property('message', 'All fields must be filled');
    })
    it('returns an error if no password is passed', async () => {
      sinon.stub(User, 'findOne').resolves();
      obj.password = '';
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property('message', 'All fields must be filled');
    })
    it('returns an error if the email is wrong', async () => {
      sinon.stub(User, 'findOne').resolves();
      obj.email = 'test@test.com';
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'Incorrect email or password');
    })
    it('returns an error if the email is invalid', async () => {
      sinon.stub(User, 'findOne').resolves();
      obj.email = '1234';
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'Incorrect email or password');
    })
    it('returns an error if the password is wrong', async () => {
      sinon.stub(User, 'findOne').resolves();
      obj.password = '1234';
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'Incorrect email or password');
    })
    it('returns a token if the information is correct', async () => {
      sinon.stub(User, 'findOne').resolves(UserMock[1] as User);
      const response = await chai.request(app)
        .post('/login')
        .send(obj);
      expect(response.body).to.have.property('token');
    })
    it('verification throws an error if the there is no token', async () => {
      sinon.stub(User, 'findOne').resolves(UserMock[1] as User);
      const response = await chai.request(app)
        .get('/login/validate');
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'Token must be a valid token');
    })
    it('verification throws an error if the token is invalid', async () => {
      sinon.stub(User, 'findOne').resolves(UserMock[1] as User);
      const response = await chai.request(app)
        .get('/login/validate')
        .auth(fakeToken, { type: 'bearer' });
      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message', 'Token must be a valid token');
    })
    it('verification returns the role', async () => {
      sinon.stub(User, 'findOne').resolves(UserMock[1] as User);
      const res = await chai.request(app)
        .post('/login')
        .send(obj)
        .then((resp) => resp.body.token);
      const response = await chai.request(app)
        .get('/login/validate')
        .auth(res, { type: 'bearer' });
      expect(response.body).to.have.property('role');
    })
  })
})
