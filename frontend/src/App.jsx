import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';
import AdminLayout from './layouts/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './hooks/useAuth';

function App() {
    const  { role } = useAuth();


    return (
        <Router>
            <ScrollToTop />
            <div className="App">
                <Routes>
                    {/* Redirect '/' to Dashboard */}
                    {role && <Route path="/" element={<Navigate to="/dashboard" replace />} />}
                    {!role && <Route path="/dashboard" element={<Navigate to="/" replace />} />}
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = DefaultLayout;
                        if (role) {
                            Layout = AdminLayout;
                        }

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
