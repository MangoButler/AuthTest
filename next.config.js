const {
    PHASE_DEVELOPMENT_SERVER,
    // PHASE_EXPORT,
    // PHASE_PRODUCTION_BUILD,
    // PHASE_PRODUCTION_SERVER,
  } = require("next/constants");
  
  module.exports = (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
      return {
        env: {
          mongodb_username: "christianhegi",
          mongodb_password: "nY0GE1QqBGx35ETk",
          mongodb_clustename: "reactcluster",
          mongodb_database: "auth-demo-dev",
        },
      };
    }
  
    return {
      env: {
        mongodb_username: "christianhegi",
        mongodb_password: "nY0GE1QqBGx35ETk",
        mongodb_clustename: "reactcluster",
        mongodb_database: "auth-demo",
      },
    };
  };