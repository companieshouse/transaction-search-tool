import * as healthCheckController from '../controllers/HealthCheckController';
import * as express from "express";


class HealthCheckRouter {

    public static create() {
        const router = express.Router();
        
        router.get("/healthcheck", healthCheckController.get);
        return router;
    }
}

export default HealthCheckRouter;