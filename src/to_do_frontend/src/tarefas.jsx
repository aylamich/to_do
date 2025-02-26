import { useState, useEffect } from 'react';
import { to_do_backend } from 'declarations/to_do_backend';

function tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(false); // Estado para controlar o spinner
  const [alertaSucesso, setAlertaSucesso] = useState(false); // Alerta para a mensagem de sucesso
  const [mensagemSucesso, setMensagemSucesso] = useState(''); // Mensagem de sucesso
  const [modalExcluir, setModalExcluir] = useState(false); // Modal de exclusão
  const [tarefaId, setTarefaId] = useState(null); // Id da tarefa que irá ser excluída

  const [totalEmAndamento, setTotalEmAndamento] = useState(0);
  const [totalConcluidas, setTotalConcluidas] = useState(0);
  
  

  useEffect(() => {
    consultarTarefas();
    buscarTotais();
  }, []);
  
  async function consultarTarefas() {
    setCarregando(true); // Ativa o spinner
    try {
      setTarefas(await to_do_backend.getTarefas());
    } catch (error) {
      console.error("Erro ao consultar tarefas:", error);
    } finally {
      setCarregando(false); // Desativa o spinner
    }
  }

  async function buscarTotais() {
    try {
      const totalAndamento = parseInt(await to_do_backend.totalTarefasEmAndamento()); // Utilização da dica dada pelo professor
      const totalConcluido = parseInt(await to_do_backend.totalTarefasConcluidas());
      setTotalEmAndamento(totalAndamento);
      setTotalConcluidas(totalConcluido);
    } catch (error) {
      console.error("Erro ao buscar totais:", error);
    }
  }

   async function handleSubmit(event) {
    event.preventDefault();
    setCarregando(true); // Ativa o spinner

    const idTarefa = event.target.elements.idTarefa.value;
    const categoria = event.target.elements.categoria.value;
    const descricao = event.target.elements.descricao.value;
    const urgente = event.target.elements.urgente.value === "false" ? false : true;

    try {
      if (idTarefa === null || idTarefa === "") {
        await to_do_backend.addTarefa(descricao, categoria, false, false);
        setMensagemSucesso('Tarefa adicionada com sucesso!');
      } else {
        await to_do_backend.alterarTarefa(parseInt(idTarefa), categoria, descricao, urgente, false);
        setMensagemSucesso('Tarefa editada com sucesso!');
      }
      setAlertaSucesso(true); // Exibe o alerta de sucesso
      setTimeout(() => setAlertaSucesso(false), 5000);
      await consultarTarefas(); // Atualiza a lista de tarefas
      await buscarTotais(); // Atualiza os totais
    } catch (error) {
      console.error("Erro ao adicionar/editar tarefa:", error);
    } finally {
      setCarregando(false); // Desativa o spinner
    }

    // Limpa o formulário
    event.target.elements.idTarefa.value = "";
    event.target.elements.categoria.value = "";
    event.target.elements.descricao.value = "";
    event.target.elements.urgente.value = "";
  }

 /* async function excluir(id) {
    setCarregando(true); // Ativa o spinner
    try {
      await to_do_backend.excluirTarefa(parseInt(id));
      await consultarTarefas(); // Atualiza a lista de tarefas
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    } finally {
      setCarregando(false); // Desativa o spinner
    }
  }
*/
  const abrirModalExcluir = (id) => {
    setTarefaId(id); // Armazena o ID da tarefa a ser excluída
    setModalExcluir(true); // Abre o modal
    
  };

  const confirmaExcluir = async () => {
    if (tarefaId) {
      setCarregando(true); // Ativa o spinner
      try {
        await to_do_backend.excluirTarefa(parseInt(tarefaId));
        await consultarTarefas(); // Atualiza a lista de tarefas
        await buscarTotais(); // Atualiza os totais
        setMensagemSucesso('Tarefa excluída com sucesso!');
        setAlertaSucesso(true); // Exibe o alerta de sucesso
        setTimeout(() => setAlertaSucesso(false), 5000);
      } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
      } finally {
        setCarregando(false); // Desativa o spinner
        setModalExcluir(false); // Fecha o modal
        setTarefaId(null); // Limpa o ID da tarefa
        await buscarTotais(); // Atualiza os totais
      }
    }
  };


  async function alterar(id, categoria, descricao, urgente, concluida) {
    setCarregando(true); // Ativa o spinner
    try {
      await to_do_backend.alterarTarefa(parseInt(id), categoria, descricao, urgente, concluida);
      await consultarTarefas(); // Atualiza a lista de tarefas
      await buscarTotais(); // Atualiza os totais
    } catch (error) {
      console.error("Erro ao alterar tarefa:", error);
    } finally {
      setCarregando(false); // Desativa o spinner
    }
  }

  async function editar( id, categoria, descricao, urgente ) {              
        document.getElementById('formTarefas').elements['idTarefa'].value = id;
        document.getElementById('formTarefas').elements['categoria'].value = categoria;
        document.getElementById('formTarefas').elements['descricao'].value = descricao; 
        document.getElementById('formTarefas').elements['urgente'].value = urgente; 
  }


  return (

    <main class="mt-[30px] mx-[30px]">
        {/* Spinner */}
      {carregando && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Alerta de sucesso */}
      {alertaSucesso && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <span className="font-medium">Sucesso!</span> {mensagemSucesso}
        </div>
      )}

       {/* Modal confirmação do excluir */}
      {modalExcluir && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
              <button
                type="button"
                onClick={() => setModalExcluir(false)}
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Fechar modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Tem certeza que deseja excluir esta tarefa?
                </h3>
                <button
                  onClick={confirmaExcluir}
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Sim, excluir
                </button>
                <button
                  onClick={() => setModalExcluir(false)}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Não, cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
        <form id="formTarefas" class="flex space-x-4" onSubmit={handleSubmit}>
            <div class="w-[15%]">
                <select id="categoria" class="block w-full px-4 py-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected>Categoria</option>
                    <option value="Trabalho">Trabalho</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Casa">Casa</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Estudo">Estudo</option>
                    <option value="Pessoal">Pessoal</option>
                    <option value="Compras">Compras</option>
                    <option value="Projetos">Projetos</option>
                    <option value="Outros">Outros</option>
                </select>
            </div>
            
            <div class="w-[85%] relative">
                <input type="text" id="descricao" class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Adicione uma tarefa" required />
                <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Adicionar</button>
            </div>
            <input type="hidden" name="idTarefa" />
            <input type="hidden" name="urgente" />

        </form>
        
        <br/>
       
        <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Tarefas em andamento</h5>
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400"> 
                  Total: {totalEmAndamento} {/* faz aparecer o total de tarefas em andamento */}
                </span>                    
            </div>

            <div class="flow-root">
                    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">

                    { tarefas.filter((ta) => !ta.concluida).map((ta) => (
                        <li class="py-3 sm:py-4">
                            <div class="flex items-center">
                                <div class="shrink-0">                                
                                    <a onClick={ () => { alterar(ta.id, ta.categoria, ta.descricao, !ta.urgente, ta.concluida) } } class="cursor-pointer" >
                                        { /* apresenta estrela cinza */ }
                                        { !ta.urgente && (
                                        <svg class="w-6 h-6 ms-2 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                        </svg>
                                        )}
                                        { /* apresenta estrela amarela */ }
                                        { ta.urgente && (
                                            <svg class="w-6 h-6 ms-2 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                            </svg> 
                                        )}                
                                    </a>
                                </div>
                                <div class="flex-1 min-w-0 ms-4">
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        { ta.categoria } 
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        { ta.descricao } 
                                    </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    
                                    <span class="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                        <a onClick={ () => { alterar(ta.id, ta.categoria, ta.descricao, ta.urgente, !ta.concluida) } } class="cursor-pointer" >
                                            <svg class="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                            </svg>
                                        </a>                                    
                                    </span>                                
                                
                                    <span class="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                        <a onClick={ () => { editar(ta.id, ta.categoria, ta.descricao, ta.urgente) } } class="cursor-pointer" >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit" >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" />
                                            </svg>
                                        </a>
                                    </span>

                                    <span class="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                        <a onClick={ () => abrirModalExcluir(ta.id)} class="cursor-pointer" >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                            </svg>
                                        </a>
                                    </span>
                                    
                                </div>
                            </div>
                        </li>
                     ))}                             
                        
                    </ul>
            </div>
        </div>

        <br/>

        <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Tarefas concluídas</h5> 
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total: {totalConcluidas} {/* faz aparecer o total de tarefas em andamento */}
                </span>                   
            </div>

            <div class="flow-root">
                    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">

                    { tarefas.filter((ta) => ta.concluida).map((ta) => (
                        <li class="py-3 sm:py-4">
                            <div class="flex items-center">
                                <div class="shrink-0">                                                                    
                                    { /* apresenta estrela cinza */ }
                                    { !ta.urgente && (
                                    <svg class="w-6 h-6 ms-2 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                    </svg>
                                    )}
                                    { /* apresenta estrela amarela */ }
                                    { ta.urgente && (
                                        <svg class="w-6 h-6 ms-2 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                        </svg> 
                                    )}                                                    
                                </div>
                                <div class="flex-1 min-w-0 ms-4">
                                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        { ta.categoria } 
                                    </p>
                                    <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                        { ta.descricao } 
                                    </p>
                                </div>                                
                            </div>
                        </li> 
                        ))}                     
                        
                    </ul>
            </div>
        </div>

    </main>
  );
}

export default tarefas