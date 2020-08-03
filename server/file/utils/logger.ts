import * as bunyan from 'bunyan';
import globalVars from '../models/globalVars';

const loggerInstance = bunyan.createLogger({
  name: 'iBlog-api',
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err
  },
  level: globalVars.logLevel as bunyan.LogLevelString,
  src: true,
});

export default {
  loggerInstance
};
