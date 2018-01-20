import unexpected from 'unexpected';
import react from 'unexpected-react/test-renderer';

unexpected.use(react);

global.expect = unexpected; // eslint-disable-line
