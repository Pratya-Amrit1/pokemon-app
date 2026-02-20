import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { fetchPokemon } from "../../utils/API";
import { Loader, NoMatch } from "../../Components";
import style from "./details.module.css";

const URL = "https://pokeapi.co/api/v2/pokemon";
export default function Details() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageParams = {
    id: searchParams.get("id") || 1,
  };

  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const getData = async (url) => {
    setLoading(true);
    fetchPokemon(url)
      .then((data) => {
        setPokemonDetails(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const url = `${URL}/${pageParams.id}`;
    !pokemonDetails && getData(url);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={style.details}>
      {!isLoading && pokemonDetails ? (
        <div className={style.detailsCard}>
          <div className={style.detailsImageContainer}>
            <img
              className={style.detailsImage}
              src={
                pokemonDetails.sprites?.other?.["official-artwork"]
                  ?.front_default
              }
              alt={pokemonDetails.name}
            />
          </div>
          <div className={style.detailsInfo}>
            <h1 className={style.detailsName}>{pokemonDetails.name}</h1>
            <p>Height : {pokemonDetails.height}</p>
            <p>Weight : {pokemonDetails.weight}</p>
            <p>Type : {pokemonDetails.types.map((type) => type.type.name)}</p>
            <p>
              Abilities :&nbsp;
              {pokemonDetails.abilities
                .map((ability) => ability.ability.name)
                .join(", ")}
            </p>
            <div className={style.statsSection}>
              <p className={style.statsTitle}>Stats</p>
              {pokemonDetails.stats.map((stat) => (
                <div className={style.statRow} key={stat.stat.name}>
                  <span className={style.statName}>{stat.stat.name}</span>
                  <span className={style.statValue}>{stat.base_stat}</span>
                  <div className={style.statBar}>
                    <div
                      className={style.statBarFill}
                      style={{
                        width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Back Button */}
          <Link to={"/"} className={style.backButton}>
            <div className={style.arrow} title='back'></div>
          </Link>
        </div>
      ) : (
        <NoMatch isLoading={isLoading} />
      )}

      {/* LoaderComponent */}
      <Loader isLoading={isLoading} />
    </div>
  );
}
