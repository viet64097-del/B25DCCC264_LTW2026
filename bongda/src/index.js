import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { NoticeProvider } from './context/NoticeContext';
import { ThemeProvider } from './context/ThemeContext';
import { store } from './store';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <NoticeProvider>
        <App />
      </NoticeProvider>
    </ThemeProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
