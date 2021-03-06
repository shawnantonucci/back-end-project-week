import React, { Component } from "react";
import { Route } from "react-router-dom";
import Login from "./components/Login";
import axios from "axios";
import NotesList from "./components/NotesList";
import Note from "./components/Note.js";
import EditNote from "./components/EditNote";
import AddNote from "./components/AddNote";
import styled, { ThemeProvider } from "styled-components";
import { Container } from "./Styles";
import "./App.css";

const url = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

class NotesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
  }

  componentDidMount() {
    axios
      .get(`${url}/notes`)
      .then(response => this.setState({ notes: response.data }))
      .catch(error => console.dir(error));

    axios
      .get("/api/current_user")
      .then(res => {
        console.log(res);
        if (res.data._id) {
          this.setState({ login: true });
        }
      })
      .catch(err => console.log(err));
  }

  updateNotes = updatedNote => {
    // console.log(updatedNote);
    const updatedNotes = this.state.notes.map(note => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      }
      return note;
    });
    this.setState({ notes: updatedNotes });
  };

  updateDeleted = targetID => {
    console.log(targetID);
    const updatedLists = this.state.notes.filter(note => {
      if (note.id === targetID) {
        return false;
      }
      return true;
    });
    this.setState({ notes: updatedLists });
  };

  addNewNotes = addedNote => {
    console.log(addedNote);
    let newNotesList = [...this.state.notes, addedNote];
    this.setState({ notes: newNotesList });
  };

  render() {
    return (
      <Container>
        <Route path="/login" component={Login} />
        <Route
          exact
          path="/"
          render={props => (
            <NotesList
              {...props}
              notes={this.state.notes}
              signOut={this.props.signOut}
            />
          )}
        />
        <Route
          path="/note/get/:id"
          render={props => (
            <Note
              {...props}
              notes={this.state.notes}
              updateNotes={this.updateNotes}
              updateDeleted={this.updateDeleted}
              signOut={this.props.signOut}
            />
          )}
        />
        <Route
          path="/note/create"
          render={props => (
            <AddNote
              {...props}
              updateNotes={this.updateNotes}
              notes={this.state.notes}
              addNewNotes={this.addNewNotes}
              signOut={this.props.signOut}
            />
          )}
        />
        <Route
          path="/note/edit/:id"
          render={props => <EditNote {...props} signOut={this.props.signOut} />}
        />
      </Container>
    );
  }
}

export default NotesPage;
