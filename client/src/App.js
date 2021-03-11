import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

// Import CSS
import './styles/App.css';

// Import Components
import Header from './components/Header';
import Courses from './components/courserelated/Courses';
import CourseDetail from './components/courserelated/CourseDetail';
import CreateCourse from './components/courserelated/CreateCourse';
import UpdateCourse from './components/courserelated/UpdateCourse';
import UserSignIn from './components/profile/UserSignIn';
import UserSignUp from './components/profile/UserSignUp';
import UserSignOut from './components/profile/UserSignOut';
import NotFound from './components/error/NotFound';
import Forbidden from './components/error/Forbidden';
import UnhandledError from './components/error/UnhandledError';
import withContext from './Context';
import PrivateRoute from './PrivateRoute';

// Connect components to Context
const HeaderWithContext = withContext(Header);
const CoursesWithContext = withContext(Courses);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CourseDetailWithContext = withContext(CourseDetail);


const App = () => {
  return (
    <Router>
      <div className="App">
        <HeaderWithContext />
        <hr />
        <Switch>
          <Route exact path="/" component={CoursesWithContext} />
          <PrivateRoute path="/courses/create" component={CreateCourseWithContext} />
          <PrivateRoute path="/courses/:id/update" component={UpdateCourseWithContext} />
          <Route exact path="/courses/:id" component={CourseDetailWithContext} />
          <Route path="/signin" component={UserSignInWithContext} />
          <Route path="/signup" component={UserSignUpWithContext} />
          <Route path="/signout" component={UserSignOutWithContext} />
          <Route path="/notfound" component={NotFound} />
          <Route path="/forbidden" component={Forbidden} />
          <Route path="/error" component={UnhandledError} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
