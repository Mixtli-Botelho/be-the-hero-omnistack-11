import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

// carrega o icone da seta para esquerda do pacote feather icons
import { FiArrowLeft } from "react-icons/fi";

// carrega a api
import api from '../../services/api';

// importa o styles local
import "./styles.css";

// carrega o logo da pasta assets
import logoImg from "../../assets/logo.svg";

export default function Account() {
  
  // instancia o history
  const history = useHistory();

  // define os states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");

  // instancia o btnSave como uma referencia
  const btnSave = useRef();

  // instancia o btnDelete como uma referencia
  const btnDelete = useRef();

  // utiliza o useEffect para carregar uma vez toda vez que for carregada a página ou se o token mudar
  useEffect(() => {
    // faz um pedido GET para a rota do backend 'profile'
    api.get('account')
      .then(response => {
        // define os incidents com o data da resposta
        setName(response.data.name);
        setEmail(response.data.email);
        setWhatsapp(response.data.whatsapp);
        setCity(response.data.city);
        setUf(response.data.uf);
    })
    .catch(err => {
      // se a pessoa não estiver logada
      if(err.response.status === 401) {
        // empurra pra pagina inicial
        history.push('/');
      }
    });
  }, [history]);

  // define a função handleUpdate
  async function handleUpdate(e) {
    // previne o funcionamento normal do envio do formulário
    e.preventDefault();

    // Desabilita o botao para que não seja enviado o formulário mais de uma vez
    btnSave.current.setAttribute('disabled', true);

    // armazena os states dentro da variavel data
    const data = {
      name,
      email,
      whatsapp,
      city,
      uf,
    };

    // bloco de declaração try, se funcionar:
    try {
      // envia os states atualizados com metodo put para a rota 'account' do backend
      const response = await api.put('account', data);

      // atualiza a variavel ongName no localStorage
      localStorage.setItem('ongName', response.data);
      
      // redireciona para o 'profile'
      history.push('/profile', {
        // com state 'updated: true'
        updated: true,
      });

    // se der erro
    } catch (error) {
      // envia alerta de erro ao navegador
      alert(error.response.data.error);
      // destrava o botao
      btnSave.current.removeAttribute('disabled');
    }
  }

  // define a função handleDeleteAccount
  async function handleDeleteAccount(e) {
    // previne o funcionamento normal do envio do formulário
    e.preventDefault();

    // Desabilita o botao para que não seja enviado o pedido mais de uma vez
    btnDelete.current.setAttribute('disabled', true);

    // bloco de declaração try, se funcionar:
    try {
      // envia metodo delete para a rota 'ongs' do backend
      await api.delete('ongs');

      // apaga todo o localStorage do navegador
      localStorage.clear();

      // redireciona para o 'profile'
      history.push('/', {
        // com state 'deleted: true'
        deleted: true,
      });

    // se der erro
    } catch (error) {
      // envia alerta de erro ao navegador
      alert(error.response.data.error);
      // destrava o botao
      btnDelete.current.removeAttribute('disabled');
    }
  }
  
  // exibe o jsx
  return (
    <div className="register-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />
          <h1> Conta </h1> <p>Atualize as informações de sua ONG ou apague sua conta de nossa aplicação.</p>
          <Link to="/profile" className="svg-link">
            <FiArrowLeft size={16} color="#E02041" />
            Voltar para o perfil
          </Link>
        </section>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Nome da ONG"
            value={name}
            required
            onChange={e => setName(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email} 
            required
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="tel" 
            placeholder="Whatsapp"
            value={whatsapp} 
            required
            minLength={10}
            maxLength={11}
            onChange={e => setWhatsapp(e.target.value)}
          />
          <div className="input-group">
            <input
              type="text"
              placeholder="Cidade" 
              value={city}
              required
              onChange={e => setCity(e.target.value)}
              style={{
                textTransform: 'capitalize'
              }}
            />
            <input
              type="text"
              value={uf}
              placeholder="UF"
              onChange={e => setUf(e.target.value)}
              required
              maxLength={2}
              style={{
                width: 80,
                textTransform: 'uppercase'
              }}
            />
          </div>
          <div className="button-group">
              <button 
                className="button cancelar"
                type="button"
                ref={btnDelete}
                // emite um alerta(confirm) e chama a função handleDeleteIncident passando o id do incident caso o usuário confirme
                onClick={(e) => { if (window.confirm('Tem certeza que quer apagar sua conta?')) handleDeleteAccount(e) } }
              >
                  Apagar conta
              </button>
              <button ref={btnSave} className="button" type="submit">
                  Atualizar
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
