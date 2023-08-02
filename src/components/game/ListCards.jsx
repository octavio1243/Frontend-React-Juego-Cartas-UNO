import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';

import apiDomain from '../../config';
import cookies from '../../cookies';
import './ListCards.css';

function ListCards(props) {
  const [visibleCards, setVisibleCards] = useState([0, 1, 2, 3]);
  const [numCards, setNumCards] = useState(props.myCards.length);
  const navigate = useNavigate();

  const handleNextClick = () => {
    if (numCards>3){
      let newIndexes = visibleCards.map((_, index) => {
        return (visibleCards[index] + 1) % props.myCards.length;
      });
      setVisibleCards(newIndexes);
      console.log(newIndexes);
    }
  };

  const handlePrevClick = () => {
    if (numCards>3){
      let newIndexes = visibleCards.map((_, index) => {
        if ((visibleCards[index] - 1) >= 0) {
          return visibleCards[index] - 1;
        }
        return props.myCards.length - 1;
      });
      setVisibleCards(newIndexes);
      console.log(newIndexes);
    }
  };

  useEffect(() => {
    if (!cookies.get("token")) {
      navigate('/login');
    }
    
    let newIndexes;
    if (numCards>props.myCards.length){
      console.log("Sacando carta");
      newIndexes = visibleCards.map((value,index) => {
        let newValue = value - 1;
        return newValue;
      });
      setVisibleCards(newIndexes);
    }
    else if (numCards<props.myCards.length){
      console.log("Agregando carta");
      newIndexes = visibleCards.map((value,index) => {
        let newValue = props.myCards.length-4+index;
        return newValue;
      });
      setVisibleCards(newIndexes);
    }

    if (visibleCards.some(value => value < 0)){
      setVisibleCards([0, 1, 2, 3]);
    }

    setNumCards(props.myCards.length);
    
  }, [props.myCards]);

  return (
    <div className="row">
      
      <div className="col-1 d-flex align-items-center">
        <button
          className="card-list-button prev align-self-center"
          id="prevButton"
          onClick={handlePrevClick}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      </div>

      <div className="col-10">
        <div className="card-list-container">
          <div className="card-list" id="cardList">
            {visibleCards.map((indexMyCards, index) => (
              props.myCards[indexMyCards] && (
                <img
                  key={indexMyCards}
                  id={props.myCards[indexMyCards].id}
                  src={apiDomain + props.myCards[indexMyCards].url}
                  alt={`Carta ${indexMyCards + 1}`}
                  className="mb-3 mt-3"
                  onClick={() => props.throwCard(props.myCards[indexMyCards].id)}
                />
              )
            ))}
          </div>
        </div>
      </div>


      <div className="col-1 d-flex align-items-center">
        <button
          className="card-list-button next align-self-center"
          id="nextButton"
          onClick={handleNextClick}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

    </div>
  );
}

export default ListCards;
