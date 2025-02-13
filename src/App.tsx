import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './components/pages/Home';

export default function App(): React.ReactElement {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
