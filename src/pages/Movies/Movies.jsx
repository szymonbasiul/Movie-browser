import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SmallTile } from "../../components/common/SmallTile/SmallTile";
import {
  fetchPopularMovies,
  selectMovies,
  selectStatus,
  selectTotalPages,
  selectCategory,
  selectSearchTotalPages,
  setCategory,
  fetchMoviesSearchResults,
  selectTotalResults,
} from "../../utils/redux/dataSlice";

import { Container, Content, Header } from "./styled";

import { NoResult } from "../NoResult/NoResult";
import { Error } from "../Error/Error";
import { StyledLoader } from "../../components/common/StyledLoader/styled";
import { Pagination } from "../../components/common/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";

export default function Movies() {
  const dispatch = useDispatch();
  const movies = useSelector(selectMovies);
  const status = useSelector(selectStatus);
  const category = useSelector(selectCategory);
  const totalPages = useSelector(selectTotalPages);
  const totalResults = useSelector(selectTotalResults);
  const searchPage = useSelector(selectSearchTotalPages);
  const searchTotalPages = useSelector(selectSearchTotalPages);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    if (searchQuery) {
      dispatch(
        fetchMoviesSearchResults({
          category: "movie",
          searchQuery: searchQuery,
          page: page,
        })
      );
    } else {
      dispatch(fetchPopularMovies({ category: "movie", page: page }));
    }
  }, [searchQuery, page, searchPage, dispatch]);

  useEffect(() => {
    dispatch(setCategory("movies"));
  }, [dispatch, category]);

  return (
    <Container>
      {status !== "error" && (
        <Header>
          {!searchQuery
            ? `Popular movies`
            : status === "loading"
            ? `Search results for "${searchQuery}"`
            : status === "success" && movies.length > 0
            ? `Search results for "${searchQuery}" (${totalResults})`
            : `Sorry, there are no results for "${searchQuery}"`}
        </Header>
      )}
      {
        {
          loading: <StyledLoader />,
          error: <Error />,
          success: (
            <>
              {movies.length > 0 ? (
                <>
                  <Content>
                    {movies?.map((movie) => (
                      <SmallTile key={nanoid()} movie={movie} />
                    ))}
                  </Content>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    searchTotalPages={searchTotalPages}
                    searchPage={searchPage}
                    searchQuery={searchQuery}
                  />
                </>
              ) : (
                <NoResult />
              )}
            </>
          ),
        }[status]
      }
    </Container>
  );
}
