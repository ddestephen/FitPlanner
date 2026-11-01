// src/App.tsx

import { AppLayout } from './layouts/AppLayout';
import { CatalogoEjerciciosView } from './features/ejercicios/components/CatalogoEjerciciosView';

function App() {
    return (
        <AppLayout>
            <CatalogoEjerciciosView />
        </AppLayout>
    );
}

export default App;