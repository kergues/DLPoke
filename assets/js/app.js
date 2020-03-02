$(document).ready(function() {
  var More
  getPokemonImage()
  onClickPokemon();
})

function cargarmas(){
  getPokemonImage(More);
}
function getPokemonImage(url){
  $("#pokemon-container").html('');
  if(!url){
    url = 'https://pokeapi.co/api/v2/pokemon/';
  }
  
  $.get(url, data => {
    More = data.next
    console.log(data);
    data.results.forEach(pokemons => {
      $.get(pokemons.url, dataPokemon => {
        //console.log(pokemons);
        let imgFront = dataPokemon.sprites.front_default
        let imgBack = dataPokemon.sprites.back_default
        let id = dataPokemon.id
        let stats = dataPokemon.stats;
        //console.log(dataPokemon);
        $("#pokemon-container").append(
          `<div class="col s12 m4 l3">
            <div class="card">
              <div class="card-image">
                <img src="` +imgFront +`">
                <span class="card-title"> Nº: ` +id+ `</span>
                <a class="btn-floating halfway-fab waves-effect waves-light btn modal-trigger" href="#modal1" data-id="` +id +`" onclick="onClickPokemon(this)"id="pokemon_` + id +`"><i class="material-icons">album</i></a>
              </div>
              <div class="card-content">
                <span class="card-title text-center">` +pokemons.name.toUpperCase() + `</span>
            </div>
          </div>
        </div>`
      );
    })
  })
})
}
function onClickPokemon(element) {
  var id = $("#" + element.id).attr("data-id");
  console.log(element);
  //Calling for the modal

  $.ajax({
    url: 'https://pokeapi.co/api/v2/pokemon/' + id
  }).done(function(response) {
    let imgFront = response.sprites.front_default
    let stats = response.stats
    var h = response.height.toString()
    var w = response.weight.toString();
    function myFunction(nu) {
      return (nu.substring(0, nu.length-1)+ "." + nu[nu.length-1]);
    }
    console.log(response);
    console.log("Nombre: " + response.name);
    $("#modal-name").html(response.name);
    $("#modal-photo").attr("src", imgFront);
    $("#pokemon-modal-name").html(response.name);
    //WEIGTH AND HEIGHT
    $("#weight").html(myFunction(w)+ " " + "Kg");
    console.log("Peso y tamaño: " + response.weight + " " + response.height);
    $("#height").html(myFunction(h) + " " + "m");
    $("#skill-number").html(response.base_experience);
    console.log("Habilidad: " + response.base_experience);
    //order
    $("#order").html(response.order);
    $("#chartContainer").html(estadisticas(stats[0].base_stat,stats[3].base_stat, stats[4].base_stat, stats[5].base_stat));
    //HABILITIES
    for (var k = 0; k < response.abilities.length; k++) {
      var abilities = response.abilities[k].ability.name;
      $("#habilities").append(abilities + " ");
      console.log("habilidades" + " " + abilities);
    }
    //Types
    for (var j = 0; j < response.types.length; j++) {
      var type = response.types[j].type.name;
      $("#type-pokemon").append(type + " ");
      console.log(type);
    }
    //Calling for the modal text
    $.ajax({
      url: 'https://pokeapi.co/api/v2/pokemon-species/' + id
    }).done(function(species) {
      console.log(species);
      $("#base_experience").html(species.flavor_text_entries[11].flavor_text);
      $("#pokemon-category").html(species.genera[4].genus);

      console.log(species.genera[0].genus);
    });
  });
}

function getPokemonId() {
  var id = $("#search")[0].value;
  console.log(id);
  if (id !== undefined) {
    findPokemons(id);
    id = " ";
  } else {
    alert("El id está indefinido");
  }
}

function findPokemons(id) {
  $.get("https://pokeapi.co/api/v2/pokemon/" + id, data => {
    console.log(data);
    let id = data.id
    let imgFront = data.sprites.front_default;
    $("#pokemon-container").html(
      `<div class="col s12 center">
        <div class="card">
          <div class="card-image">
            <img src="` +imgFront +`">
            <span class="card-title"> Nº: ` +id+ `</span>
            <a class="btn-floating halfway-fab waves-effect waves-light btn modal-trigger" href="#modal1" data-id="` +id +`" onclick="onClickPokemon(this)"id="pokemon_` + id +`"><i class="material-icons">album</i></a>
          </div>
          <div class="card-content">
            <span class="card-title text-center">` +data.name.toUpperCase() + `</span>
        </div>
      </div>
    </div>
    <div class="back center"><a href="" onclick="findPokemons()" class="waves-effect waves-light btn back-search">Volver</a></div>`
  );
  });
}

function estadisticas(spedd, defense,attack, hp){
  var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title:{
        text: "Estadísticas",
        horizontalAlign: "left"
      },
      data: [{
        type: "doughnut",
        startAngle: 60,
        //innerRadius: 60,
        indexLabelFontSize: 17,
        indexLabel: "{label} - #percent%",
        toolTipContent: "<b>{label}:</b> {y} (#percent%)",
        dataPoints: [
          { y: spedd, label: "Velacidad" },
          { y: defense, label: "Defensa" },
          { y: attack, label: "Ataque" },
          { y: hp, label: "Puntos de vida" }
        ]
      }]
    });
    chart.render();
    
    }

