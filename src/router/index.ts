import {baseRouter} from "./base.ts";
import {backendRouter} from "@/router/modules/backend.ts";

const routes = [
    ...baseRouter,
    ...backendRouter
]

export default routes;