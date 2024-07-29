let generoId;
let decada;
let decadaInicio;
let decadaFim;
let nota;
let duracao;
let page;


document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('notaRange').value = 8;
    document.getElementById('nota').innerText = 8;

    document.getElementById('tempoRange').value = 240;
    document.getElementById('tempo').innerText = 240;

    document.getElementById('notaRange').addEventListener('input', e => {
        document.getElementById('nota').innerText = e.target.value
    })
    
    document.getElementById('tempoRange').addEventListener('input', e => {
        document.getElementById('tempo').innerText = e.target.value
    })

    carregaGenero();
    carregaDecada();
    setupBuscar();
});

function carregaGenero(){
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlN2IzYzQ2MmE2NGZkMjRmOGI0OTkxMTQwZmU5ZmIzMSIsIm5iZiI6MTcyMjE5OTY4NS40NTA1MDMsInN1YiI6IjYyN2ZjODAxMGQ1ZDg1MDcwNGNhYWRkYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JDIwnutF94KDF713QSb6pzmo35csg5GJM6Wbu89Dghs'
        }
      };
      
      fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
        .then(response => response.json())
        .then(response => {
            const generos = response.genres.map((x) => x);
            generos.forEach(element => {
                var decadaSelect = document.getElementById("generoSelect");
                var option = document.createElement("option");
                option.text = element.name;
                option.id = element.id;
                decadaSelect.add(option);
            });
        })
        .catch(err => console.error(err));
}

function carregaDecada(){
    const decadas = [
        '1950 - 1960',
        '1960 - 1970',
        '1970 - 1980',
        '1980 - 1990',
        '1990 - 2000',
        '2000 - 2010',
        '2010 - 2020',
        '2020 - 2030'];

    decadas.forEach(element => {
        var decadaSelect = document.getElementById("decadaSelect");
        var option = document.createElement("option");
        option.text = element;
        decadaSelect.add(option);
    });        
}

function setupBuscar(){
    const form = document.getElementById("submitForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const generoDropdownList = document.getElementById('generoSelect')
        generoId = generoDropdownList.options[generoDropdownList.selectedIndex].id

        const decadaDropdownList = document.getElementById('decadaSelect')
        decada = decadaDropdownList.options[decadaDropdownList.selectedIndex].value

        decadaInicio = decada.slice(0, 4);
        decadaFim = decada.slice(7, 11);

        nota = document.getElementById('notaRange').value
        duracao = document.getElementById('tempoRange').value
        page = 1;
        fetchFilmes();
      });
}

function detalhes(filmes){
    if(filmes.length == 0){
        document.getElementById("alerta").classList.remove("d-none");
        document.getElementById("submitForm").classList.remove("d-none");
        document.getElementById("spinner").classList.add("d-none");
    } 
    else{
        document.getElementById("alerta").classList.add("d-none");
        const form = document.getElementById("submitForm");
        form.classList.add("d-none");

        const conatinerDetalhes = document.getElementById("conatinerDetalhes");
        conatinerDetalhes.classList.remove("d-none");

        let filme = Math.floor(Math.random() * filmes.length);
        console.log(filme)
        carregaDetalhes(filmes[filme]);
        

        addButtonsLayout();

        const btRandom = document.getElementById("btRandom");
        btRandom.disabled = false;
        btRandom.addEventListener('click', () => {
            document.getElementById("spinner").classList.remove("d-none");
            filmes = filmes.filter(item => item !== filmes[filme])
            if(filmes.length == 0){
                btRandom.disabled = true;
                page++;
                fetchFilmes();
            }
            else{
                filme = Math.floor(Math.random() * filmes.length);
                carregaDetalhes(filmes[filme])
            }
        });

        const btFiltro = document.getElementById("btFiltro")
        btFiltro.addEventListener('click', () => {
            form.classList.remove("d-none");
            conatinerDetalhes.classList.add("d-none");
        });
    }
}

function addButtonsLayout(){
    const container = document.getElementById("conatinerDetalhes");

    if(document.getElementById("botoes") != null)    
        document.getElementById("botoes").remove();

    const newDiv = document.createElement("div");
    newDiv.setAttribute("id","botoes")
    newDiv.setAttribute("class","d-flex justify-content-center p-4")

    const btRandom = document.createElement("button");
    btRandom.setAttribute("id","btRandom")
    btRandom.setAttribute("class","btn btn-primary ps-4 pe-4 me-2");
    btRandom.innerText = 'Próximo'

    const btFiltro = document.createElement("button");
    btFiltro.setAttribute("id","btFiltro")
    btFiltro.setAttribute("class","btn btn-warning ps-4 pe-4")
    btFiltro.innerText = 'Ajustar filtro'

   
    newDiv.append(btRandom)
    newDiv.append(btFiltro)
    container.append(newDiv)
}

function carregaDetalhes(filme){
    document.getElementById("conatinerDetalhes").classList.add("d-none");
    document.getElementById("img").src = './img/sem-foto.jpg'
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlN2IzYzQ2MmE2NGZkMjRmOGI0OTkxMTQwZmU5ZmIzMSIsIm5iZiI6MTcyMjE5OTY4NS40NTA1MDMsInN1YiI6IjYyN2ZjODAxMGQ1ZDg1MDcwNGNhYWRkYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JDIwnutF94KDF713QSb6pzmo35csg5GJM6Wbu89Dghs'
        }
      };
      
      fetch(`https://api.themoviedb.org/3/movie/${filme.id}?language=en-US`, options)
        .then(response => response.json())
        .then(response => {
            document.getElementById("img").src = `https://image.tmdb.org/t/p/w500/${response.poster_path}`
            document.getElementById("titulo").innerText = response.title
            document.getElementById("lancamento").innerText = new Date(response.release_date).toLocaleDateString('en-GB')
            document.getElementById("descricao").innerText = response.overview
            document.getElementById('generos').innerHTML = '';
            response.genres.forEach((genero) => {
                document.getElementById('generos').innerHTML += `<span class="badge bg-light text-dark ms-1 me-1">${genero.name}</span>`
            })
            document.getElementById("spinner").classList.add("d-none");
            document.getElementById("conatinerDetalhes").classList.remove("d-none");
        })
        .catch(err => console.error(err));    
}

function fetchFilmes(){
    document.getElementById("conatinerDetalhes").classList.add("d-none");
    document.getElementById("spinner").classList.remove("d-none");
    document.getElementById("submitForm").classList.add("d-none");

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlN2IzYzQ2MmE2NGZkMjRmOGI0OTkxMTQwZmU5ZmIzMSIsIm5iZiI6MTcyMjE5OTY4NS40NTA1MDMsInN1YiI6IjYyN2ZjODAxMGQ1ZDg1MDcwNGNhYWRkYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JDIwnutF94KDF713QSb6pzmo35csg5GJM6Wbu89Dghs'
        }
    };
      
    fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_date.gte=${decadaInicio}-01-01&primary_release_date.lte=${decadaFim}-12-31&sort_by=popularity.asc&with_genres=${generoId}&vote_average.gte=${nota}&vote_average.lte=10&with_runtime.gte=30&with_runtime.lte=${duracao}&vote_count.gte=800&vote_count.lte=100000`, options)
        .then(response => response.json())
        .then(response => {
            detalhes(response.results.map((x) => x))
        })
        .catch(err => console.error(err));
}