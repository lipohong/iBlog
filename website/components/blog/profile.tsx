import { compose } from 'redux';
import { connect } from 'react-redux';
import * as _ from 'lodash';
const moment = require( "moment" );

import defaultNextI18Next from '../../plugins/i18n';
const { Link, withTranslation } = defaultNextI18Next;
import { PaletteTypeEnum } from '../../enums/PaletteTypeEnum';

// mui
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


function AuthorProfile(props) {
  const { userId, username, avatar, updatedDate, showFollow, auth, paletteType, t } = props;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        <Link href={`/user/profile/${userId}`}>
          <Avatar src={`${avatar}`} style={{ width: '50px', height: '50px', cursor: 'pointer' }}>
            { !avatar && username[0] }
          </Avatar>
        </Link>
      </Grid>
      <Grid item>
        <Grid container>
          <Grid item xs={12}>
            <Link href={`/user/profile/${userId}`}>
              <div style={{ cursor: 'pointer', wordBreak: "break-word" }}>{username}</div>
            </Link>
          </Grid>
          <Grid item xs={12}>
            {
              (!showFollow && updatedDate ||( showFollow && userId === _.get(auth, 'userId') && updatedDate)) &&
              <div className="updatedDate">{moment(updatedDate).format('YYYY-MM-DD HH:mm:ss')}</div>
            }
            {
              showFollow && userId !== _.get(auth, 'userId') &&
              <Button
                size="small"
                variant="outlined"
                color={ paletteType === PaletteTypeEnum.light ? 'primary' : 'default' }
              >
                Follow
              </Button>
            }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state) => {
  const { global, auth } = state;
  return {
    paletteType: global && global.paletteType || PaletteTypeEnum.light,
    auth: auth && auth.auth
  }
}

export default compose<any>(
  connect(mapStateToProps),
  withTranslation('common')
)(AuthorProfile)