"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Dashboard_1 = __importDefault(require("./components/Dashboard"));
const AddRecord_1 = __importDefault(require("./components/AddRecord"));
const EditRecord_1 = __importDefault(require("./components/EditRecord"));
const EmailVerification_1 = __importDefault(require("./components/EmailVerification"));
const ErrorBoundary_1 = __importDefault(require("./components/ErrorBoundary"));
const login_1 = __importDefault(require("./components/login")); // Ensure consistent casing
const PasswordRecovery_1 = __importDefault(require("./components/PasswordRecovery"));
const PasswordReset_1 = __importDefault(require("./components/PasswordReset"));
const Register_1 = __importDefault(require("./components/Register"));
require("../styles.css"); // Ensure the path is correct
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(false);
    const [userRole, setUserRole] = (0, react_1.useState)('');
    return (react_1.default.createElement(ErrorBoundary_1.default, null,
        react_1.default.createElement(react_router_dom_1.Routes, null,
            react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(login_1.default, { setIsAuthenticated: setIsAuthenticated, setUserRole: setUserRole }) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/register", element: react_1.default.createElement(Register_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/verify-email", element: react_1.default.createElement(EmailVerification_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/recover-password", element: react_1.default.createElement(PasswordRecovery_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/reset-password", element: react_1.default.createElement(PasswordReset_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/dashboard", element: react_1.default.createElement(Dashboard_1.default, { userRole: userRole }) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/add-record", element: react_1.default.createElement(AddRecord_1.default, null) }),
            react_1.default.createElement(react_router_dom_1.Route, { path: "/edit-record/:id", element: react_1.default.createElement(EditRecord_1.default, null) }))));
};
exports.default = App;
