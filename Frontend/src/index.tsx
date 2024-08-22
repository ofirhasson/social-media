import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Routing } from "./Components/LayoutArea/Routing/Routing";
import "./index.css";
import { appStore } from "./Redux/Store";
import reportWebVitals from "./reportWebVitals";
import { interceptors } from "./Utils/Interceptors";


interceptors.listen();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Provider store={appStore}>  
      <Routing/>  
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
