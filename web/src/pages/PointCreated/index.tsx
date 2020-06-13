import React, { useEffect } from 'react';

import './styles.css';
import { IconContext } from 'react-icons';
import { FiCheckCircle } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

const PointCreated = () => {

  const history = useHistory();
  const timeout = 3000;

  useEffect(() => {
    setTimeout(() => {
      history.push('/');
    }, timeout);
  }, [history]);

  return (
    <div id="point-created">
      <div id="icon-div">
        <IconContext.Provider value={{ color: "#34CB79", size: "2.5em" }}>
          <div>
            <FiCheckCircle />
          </div>
        </IconContext.Provider>
      </div>
      <h1>Cadastro concluído!</h1>
    </div>
  )

}

export default PointCreated;  