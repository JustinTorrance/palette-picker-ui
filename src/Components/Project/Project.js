import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import shortid from 'shortid';
import Palette from '../../Containers/Palette/Palette';
import fetchProjectsThunk from '../../Thunks/fetchProjectsThunk';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography'

export class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      palettes: [],
      open: false
    }
  }

  toggleDrawer = () => {
    this.setState(state => ({ open: !state.open }));
    this.fetchPalette();
  };

  fetchPalette = async () => {
    const { project } = this.props;
    const id = project.id;
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/projects/${id}/palettes`);
    if (response.ok) {
      const data = await response.json();
      this.setState({ palettes: data });
    }
  }

  deleteProject = async () => {
    const { project } = this.props;
    const id = project.id;
    const options = { method: 'DELETE' }
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/projects/${id}`, options);
    this.props.fetchProjectsThunk();
  }

  render() {
    const { project } = this.props;
    const { palettes, open } = this.state;
    return (
      <div>
        <ListItem button onClick={this.toggleDrawer}>
          <ListItemIcon>{<i className="material-icons">palette</i>}</ListItemIcon>
          <ListItemText inset primary={project.project_name} />
          <ListItemIcon>{<i className="material-icons" onClick={this.deleteProject}>delete</i>}</ListItemIcon>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          { palettes.length === 0 ? <Typography variant="subtitle1" id="empty-project" >This project is empty</Typography> : palettes.map((palette) => (
            <Palette key={shortid.generate()} palette={palette} fetchPalette={this.fetchPalette} />
          ))}
        </Collapse>
        <Divider />
      </div>
    )
  }
}

Project.propTypes = {
  project: PropTypes.object.isRequired,
};

export const mapDispatchToProps = (dispatch) => ({
  fetchProjectsThunk: () => dispatch(fetchProjectsThunk())
})

export default connect(null, mapDispatchToProps)(Project);