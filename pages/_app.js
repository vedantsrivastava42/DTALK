import "../styles/globals.css";

//INTERNAL IMPORT
import { ChatAppProvider } from "../Context/ChatAppContext";
import { NavBar, Notification } from "../Components/index";

const MyApp = ({ Component, pageProps }) => (
  <ChatAppProvider>
    <NavBar />
    <Notification />
    <main>
      <Component {...pageProps} />
    </main>
  </ChatAppProvider>
);

export default MyApp;
