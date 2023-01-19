import "./User.css";

import dataJson from "../data.json";

import StarRatings from "react-star-ratings";

import { useState, useRef, useEffect } from "react";

const User = () => {
  const [availableGenre, setAvailableGenre] = useState([]);
  const [availableRatings, setAvailableRatings] = useState([]);

  //Hooks To Handle State
  const [data, setData] = useState(null);
  const [openRating, setOpenRating] = useState(false);
  const [openGenre, setOpenGenre] = useState(false);
  const [ratingOptions, setRatingOptions] = useState(availableRatings);
  const [genreOptions, setGenreOptions] = useState(availableGenre);
  let [searchText, setSearchText] = useState("");

  //UseEffect To Set Initial Data
  useEffect(() => {
    let tempAvailableRating = [];
    let maxRating = Math.max(...dataJson.map((x) => x.Ranking));
    maxRating = Math.floor(maxRating);
    for (let i = 1; i <= maxRating; i++) {
      tempAvailableRating.push({ value: i, checked: false });
    }
    setAvailableRatings(tempAvailableRating);
    setRatingOptions(tempAvailableRating);

    let tempAvailableGenre = [{ value: "Any Genre", checked: false }];
    dataJson
      .map((x) => x.Category)
      .filter((item, pos, self) => self.indexOf(item) === pos)
      .forEach((item) => {
        tempAvailableGenre.push({ value: item, checked: false });
      });
    setAvailableGenre(tempAvailableGenre);
    setGenreOptions(tempAvailableGenre);
  }, []);

  //UseRef To Get Input Value
  const inputRef = useRef();

  const getSearchResult = (event) => {
    const value = event.target.value;
    setSearchText(value);
    filterRecords(value);
  };

  //Function To Handle Rating Dropdown
  const ratingDropdownFunction = () => {
    setOpenGenre(false);
    setOpenRating(!openRating);
  };

  //Function To Handle Genre Dropdown
  const genreDropdownFunction = () => {
    setOpenRating(false);
    setOpenGenre(!openGenre);
  };

  //React Inner Component To Render Data
  const CmpData = ({ data }) => {
    return (
      <>
        {data.map((item, index) => {
          return (
            <>
              <div className="mb-4" key={index}>
                <h6 className="p-0 m-0 ">{item.title}</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <StarRatings
                    rating={Number(item.Ranking)}
                    starRatedColor="black"
                    numberOfStars={10}
                    name="rating"
                    starDimension="19px"
                    starSpacing="1px"
                    ignoreInlineStyles={false}
                    starWidthAndHeight="5px"
                  />
                  <p>{item.Category}</p>
                </div>
              </div>
            </>
          );
        })}
      </>
    );
  };

  const filterRecords = (searchKey) => {
    let selectedRating = ratingOptions
      .filter((x) => x.checked)
      .map((x) => x.value);

    let selectedGenre = genreOptions
      .filter((x) => x.checked)
      .map((x) => x.value);

    let result = [];

    if (selectedRating.length || selectedGenre.length || searchKey)
      dataJson.forEach((item) => {
        let ratingExists = selectedRating.length
          ? selectedRating.includes(Math.floor(item.Ranking))
          : true;
        let genreExists = selectedGenre.length
          ? selectedGenre.includes(item.Category)
          : true;
        let searchKeyExists = !!searchKey
          ? item.title.toLowerCase().includes(searchKey.toLowerCase())
          : true;
        if (ratingExists && genreExists && searchKeyExists) {
          result.push(item);
        }
      });
    else result = null;
    setData(result);

    if (selectedGenre.includes("Any Genre")) {
      setData(dataJson);
    }
  };

  const updateRatingOption = (item) => {
    item.checked = !item.checked;
  };

  const updateGenreOption = (item) => {
    item.checked = !item.checked;
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row mt-5">
          <div className="col-md-2"></div>
          <div className="col-md-5 ">
            <input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={getSearchResult}
              className="inputCustom"
              placeholder="Enter Movie Name"
            />
            {!data ? (
              <p>No Data</p>
            ) : !data.length ? (
              <p>No Data in Current Selection</p>
            ) : (
              <div className={"border p-2 mt-3 "}>
                <CmpData data={data} />
              </div>
            )}
          </div>
          <div className="col-md-3 mt-2">
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center border">
                <button
                  onClick={ratingDropdownFunction}
                  className="btn d-flex align-items-center justify-content-between"
                >
                  Rating
                  <span className="material-icons">
                    {openRating ? "expand_less" : "expand_more"}
                  </span>
                </button>
              </div>

              <div className="d-flex align-items-center justify-content-between border">
                <button
                  onClick={genreDropdownFunction}
                  className="btn d-flex align-items-center justify-content-between"
                >
                  Genre
                  <span className="material-icons">
                    {openRating ? "expand_less" : "expand_more"}
                  </span>
                </button>
              </div>
            </div>
            {openRating ? (
              <div className="border mt-2 p-2">
                {ratingOptions.map((item, index) => {
                  return (
                    <div key={index}>
                      <input
                        type="checkbox"
                        value={item.value}
                        checked={item.checked}
                        onChange={(e) => {
                          updateRatingOption(item);
                          filterRecords(searchText);
                        }}
                      />
                      <StarRatings
                        rating={item.value}
                        starRatedColor="black"
                        numberOfStars={10}
                        name="rating"
                        starDimension="18px"
                        starSpacing="2px"
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}

            {openGenre ? (
              <div className="border mt-2 p-2" style={{ float: "right" }}>
                <div className="mb-2">
                  {genreOptions.map((item, index) => {
                    return (
                      <div className="d-flex ">
                        <input
                          type="checkbox"
                          value={item.value}
                          checked={item.checked}
                          onChange={(e) => {
                            updateGenreOption(item);
                            filterRecords(searchText);
                          }}
                        />
                        <h6>{item.value}</h6>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </>
  );
};
export default User;
