import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import OverviewPage from "@/components/pages/OverviewPage";
import FlowPage from "@/components/pages/FlowPage";
import DiagramsPage from "@/components/pages/DiagramsPage";
import DocsPage from "@/components/pages/DocsPage";
import LearningPage from "./components/pages/LearningPage";

export default function App() {
    return (
        <AppShell>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/overview"
                            replace
                        />
                    }
                />
                <Route
                    path="/overview"
                    element={<OverviewPage />}
                />
                <Route
                    path="/flow"
                    element={<FlowPage />}
                />
                <Route
                    path="/diagrams"
                    element={<DiagramsPage />}
                />
                <Route
                    path="/docs"
                    element={<DocsPage />}
                />
                <Route
                    path="/learning"
                    element={<LearningPage />}
                />
            </Routes>
        </AppShell>
    );
}
