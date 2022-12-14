import "./App.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState } from "react";
import { championList } from "./utils/champion-list";

// Set nessecary... things
const appName = "LolChestGranted";
const riotAPI = "https://euw1.api.riotgames.com/lol/";
const champIconsPath = "./images/champion-squares-compressed/";
const api_key = "RGAPI-f037bcb7-fe33-4d0a-99b4-b4c0ad8dbd36";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

function App() {
  // Values
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [accountId, setAccountId] = useState("");
  const [imageSize, setImageSize] = useState("60px");
  const [searchFilter, setSearchFilter] = useState("");
  const [chestGrantedFilter, setChestGrantedFilter] = useState(1);
  const [page, setPage] = useState("home");

  // Stylings
  const championImageStyling = {
    width: imageSize,
    height: imageSize,
  };

  const getUserInfo = () => {
    console.log("Getting user information for: " + username);
    try {
      axios
        .get(
          riotAPI +
            "summoner/v4/summoners/by-name/" +
            username +
            "?api_key=" +
            api_key
        )
        .then((response) => {
          setAccountId(response.data.id);
        });
      axios
        .get(
          riotAPI +
            "champion-mastery/v4/champion-masteries/by-summoner/" +
            accountId +
            "?api_key=" +
            api_key
        )
        .then((response) => {
          setData(response.data);
          console.log(data);
          data.forEach((champion, index) => {
            if (championList[champion.championId] !== undefined) {
              champion["name"] = championList[champion.championId];
            } else {
              console.log("Id of the fucked champ: " + champion.championId);
            }
          });
        });
    } catch (error) {
      setAccountId("");
      setData([]);
    }
  };

  const handlePageChange = (pageName) => {
    setPage(pageName);
    setSearchFilter("");
    setChestGrantedFilter(1);
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" id="navbar">
        <Container>
          <Navbar.Brand>
            <h2 onClick={() => handlePageChange("home")} id="title">
              {appName}
            </h2>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => handlePageChange("about")}>About</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Enter LoL Name"
              className="me-2"
              aria-label="Search"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button variant="outline-success" onClick={() => getUserInfo()}>
              Search
            </Button>
          </Form>
        </Container>
      </Navbar>
      <div>
        {page === "home" ? (
          <div>
            <div>
              <Container id="sorting-bar" className="d-flex align-items-center">
                <Row className="d-flex align-items-center">
                  <Col xs={12} md={4} lg={4}>
                    <Form className="d-flex">
                      <Form.Control
                        type="search"
                        placeholder="Filter Champions"
                        className="me-2"
                        aria-label="Search"
                        onChange={(e) => setSearchFilter(e.target.value)}
                      />
                    </Form>
                  </Col>
                  <Col xs={12} md={4} lg={4}>
                    <p id="image-size-text">Image Size: {imageSize}</p>
                    <Form.Range
                      onChange={(e) => setImageSize(e.target.value + "px")}
                    />
                  </Col>
                  <Col xs={6} md={4} lg={4}>
                    <label>
                      <input
                        type="checkbox"
                        className="checkboxes"
                        onChange={(e) =>
                          setChestGrantedFilter(!e.target.checked)
                        }
                      />
                      Chest Granted
                    </label>
                  </Col>
                  {/* <Col xs={6} md={6} lg={4}>
                    <label>
                      <input type="checkbox" className="checkboxes" />
                      My Value
                    </label>
                  </Col> */}
                </Row>
              </Container>
            </div>
            <div id="champion-section">
              <div className="page_split">
                <div className="image-container">
                  {data.map((champion) => {
                    champion["name"] =
                      championList[champion.championId].toLowerCase();
                    if (
                      champion.chestGranted &&
                      !chestGrantedFilter &&
                      (searchFilter === "" ||
                        champion.name.includes(searchFilter.toLowerCase()))
                    ) {
                      try {
                        if (champion.name.includes(searchFilter)) {
                          return (
                            <img
                              key={champion.championId}
                              style={championImageStyling}
                              alt={champion.name}
                              src={require(champIconsPath +
                                champion.championId +
                                ".png")}
                            />
                          );
                        }
                      } catch (e) {
                        return (
                          <img
                            key={champion.championId}
                            style={championImageStyling}
                            alt={champion.name}
                            src={require(champIconsPath +
                              champion.championId +
                              ".png")}
                          />
                        );
                      }
                    }
                  })}
                </div>
              </div>
              <div className="page_split">
                <div className="image-container">
                  {data.map((champion) => {
                    champion["name"] =
                      championList[champion.championId].toLowerCase();
                    if (
                      (!champion.chestGranted || chestGrantedFilter) &&
                      (searchFilter === "" ||
                        champion.name.includes(searchFilter.toLowerCase()))
                    ) {
                      try {
                        if (champion.name.includes(searchFilter)) {
                          return (
                            <img
                              key={champion.championId}
                              style={championImageStyling}
                              alt={champion.name}
                              src={require(champIconsPath +
                                champion.championId +
                                ".png")}
                            />
                          );
                        }
                      } catch (e) {
                        return (
                          <img
                            key={champion.championId}
                            style={championImageStyling}
                            alt={champion.name}
                            src={require(champIconsPath +
                              champion.championId +
                              ".png")}
                          />
                        );
                      }
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div id="about-section">
            <div id="about-page">
              <h1>About This Website</h1>
              <h5>
                This website was made to enable LoL-players to check which of
                their champions has a chest available. This will allow the
                player to optimize their loot per match.
                <br />
                The site is free and without ads, but if you're feeling
                generous, you can donate to me here:{" "}
                <a href="https://paypal.me/TeNoDk" target="_blank">
                  paypal.me
                </a>
              </h5>
              <br />
              <p>
                {appName} is not endorsed by Riot Games and doesn't reflect the
                views or opinions of Riot Games or anyone officially involved in
                producing or managing Riot Games properties. Riot Games, and all
                associated properties are trademarks or registered trademarks of
                Riot Games, Inc.
              </p>
              <br />
              <br />
              <p>Get the source code for this project here:</p>
              <a href="https://github.com/samuel1212703/chestgranted">Github</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
