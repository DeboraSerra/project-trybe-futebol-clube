import * as express from 'express';
import * as cors from 'cors';
import 'express-async-errors';
import ErrorMid from './middlewares/error.middleware';
import LoginRoute from './routes/Login.route';
import TeamRoute from './routes/Team.route';
import MatchRoute from './routes/Match.route';
import LeaderboardRoute from './routes/Leaderboard.route';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
    this.app.use(cors());

    this.app.use('/leaderboard', LeaderboardRoute);
    this.app.use('/login', LoginRoute);
    this.app.use('/matches', MatchRoute);
    this.app.use('/teams', TeamRoute);
    this.app.use(ErrorMid);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
