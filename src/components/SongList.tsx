import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "..";
import { fetchAllSongs } from "../reducers/songReducer";
import { ISong } from "../api/dtos/Song";
import up from "../assets/icons/up-arrow.png";
import down from "../assets/icons/down-arrow.png";
import prevIcon from "../assets/icons/back-icon.png";
import nextIcon from "../assets/icons/next-icon.png";

export const SongList = () => {
  const dispatch = useAppDispatch();
  const { songs } = useAppSelector((state) => state.SongSliceReducer);
  const [allSongs, setAllSongs] = useState<ISong[]>();
  const [sortedSongs, setSortedSongs] = useState<ISong[]>();
  const VISIBLE_FIELDS = ["singer", "song", "genre", "year"];
  const [next, setNext] = useState(1);
  const [sort, setSort] = useState<"up" | "down" | null>();
  const [rowSize, setRowSize] = useState(4);

  useEffect(() => {
    dispatch(fetchAllSongs());
  }, [dispatch]);

  useEffect(() => {
    setAllSongs(songs);
  }, [songs]);

  const sortSongs = (field: string) => {
    const sortedArr = [...songs] as ISong[];
    sortedArr.sort((one: any, two: any) =>
      one[field] > two[field]
        ? sort === "up"
          ? -1
          : 1
        : sort === "up"
        ? 1
        : -1
    ) as ISong[];
    setSortedSongs(sortedArr);
    setSort(sort === "up" ? "down" : "up");
  };

  const renderPaginationNumbers = useCallback(() => {
    let temp = Math.ceil((sortedSongs || songs).length / rowSize);
    let renderNumbers: number[] = [];
    let cur = next;
    while (cur <= temp) {
      renderNumbers = [...renderNumbers, cur];
      cur++;
    }
    return (
      <div className="numbers">
        {renderNumbers.map((num, i) => {
          return <h3 className={i + 1 === cur ? "active number" : "number"}>{num}</h3>;
        })}
      </div>
    );
  }, [next, rowSize, songs, sortedSongs]);

  const filterByField = (field: string, value: string) => {
    setAllSongs(
      songs?.filter((song: any) =>
        song[field].toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  console.log(rowSize * next > songs.length);

  return (
    <div className="main">
      <div className="table">
        <h1>Playlist</h1>
        <div className="columns mt-1">
          {VISIBLE_FIELDS.map((el: any) => {
            return (
              <div className="flex">
                <h3>{el}</h3>
                <button
                  onClick={() => sortSongs(el)}
                  className="btn columns__btn"
                >
                  <img
                    src={sort === "down" ? down : up}
                    alt="icon"
                    className="icon"
                  ></img>
                </button>
              </div>
            );
          })}
        </div>
        {(sortedSongs || allSongs)
          ?.slice(next * rowSize - rowSize || 0, rowSize * next)
          .map((song: ISong) => {
            return (
              <div key={song.id} className="columns">
                <h5>{song.singer}</h5>
                <h5>{song.song}</h5>
                <h5>{song.genre}</h5>
                <h5>{song.year}</h5>
              </div>
            );
          })}
        <div className="pagination">
          <div className="pagination__slider">
            {next * rowSize - rowSize > 1 ? (
              <button
                className="btn"
                onClick={() => setNext((prev) => prev - 1)}
              >
                <img src={prevIcon} alt="icon" className="icon"></img>
              </button>
            ) : null}
            {renderPaginationNumbers()}
            {rowSize * next < songs?.length ? (
              <button
                className="btn"
                onClick={() => setNext((prev) => prev + 1)}
              >
                <img src={nextIcon} alt="icon" className="icon"></img>
              </button>
            ) : null}
          </div>
          <div className="pagination__size">
            <button
              className=" pagination__size__btn"
              onClick={() => setRowSize(4)}
            >
              <h5>4</h5>
            </button>
            <button
              className=" pagination__size__btn"
              onClick={() => setRowSize(8)}
            >
              <h5>8</h5>
            </button>
            <button
              className=" pagination__size__btn"
              onClick={() => setRowSize(12)}
            >
              <h5>12</h5>
            </button>
          </div>
        </div>
      </div>
      <div className="filter">
        <h1>Filter</h1>
        <div className="filter__item mt-1">
          <h4>Signer</h4>
          <input
            placeholder="All"
            onChange={(value) => filterByField("singer", value.target.value)}
          ></input>
        </div>

        <div className="filter__item">
          <h4>Genre</h4>
          <input
            placeholder="All"
            onChange={(value) => filterByField("genre", value.target.value)}
          ></input>
        </div>

        <div className="filter__item">
          <h4>Signer</h4>
          <input
            placeholder="All"
            onChange={(value) => filterByField("year", value.target.value)}
          ></input>
        </div>
      </div>
    </div>
  );
};
