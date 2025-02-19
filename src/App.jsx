import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
// import "./navBar.css";
import PageLayout from "./PageLayout";
import MainPage from "./Components/MainPage";
import Login from "./Components/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import StudentsPage from "./Components/StudentsPage";
import CoursesPage from "./Components/CoursesPage";
import UsersPage from "./Components/UsersPage";
import ProductsPage from "./Components/ProductsPage";
import MessagesPage from "./Components/MessagesPage";
import CourseDetails from "./Components/CourseDetails";
import NotFound from "./Components/404Page";
// import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <PageLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <MainPage />,
        },
        {
          path: "/students",
          element: <StudentsPage />,
        },
        {
          path: "/courses",
          element: <CoursesPage />,
        },
        {
          path: "/products",
          element: <ProductsPage />,
        },
        {
          path: "/users",
          element: <UsersPage />,
        },
        {
          path: "/messages",
          element: <MessagesPage />,
        },
        { path: "/course/:id", element: <CourseDetails /> },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    // <LanguageProvider>
    <div>
      <RouterProvider router={router} />
    </div>
    // </LanguageProvider>
  );
}

export default App;
