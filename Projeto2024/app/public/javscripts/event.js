class Event{
    constructor(nome,dia,mes,ano,local,hora,uc){
      this.nome = nome
      this.dia = dia
      this.mes = mes
      this.ano = ano
      this.local = local
      this.hora = hora
      this.uc = uc
    }
}
  
  class WeeklyEvent{
    constructor(nome,dia,ano,local,hora,uc,turno){
      this.nome = nome
      this.dia = dia
      this.ano = ano
      this.local = local
      this.hora = hora
      this.uc = uc
      turno ? this.turno = turno : this.turno = "Turno 1"
    }
  }
  
  function extractInfoDatas(obj,nome,id){
    let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    let info = /(?<dia>\d+).*?(?<mes>[A-Z][a-z]+) \((?<hora>\d+h-\d+h)\); salas? (?<local>.+)/.exec(obj)
    let ano = parseInt(id.replace(/[A-Za-z]+/,''))
    if (info){
      info = info.groups
      info.mes = meses.findIndex((mes) => mes  === info.mes)
      info.dia = parseInt(info.dia)
      return new Event(nome,info.dia,info.mes,ano,info.local,info.hora,id)
    }
    return 0
  }
  
  function extractInfoAulas(obj,nome,id){
    let dias = ["domingo","segunda","terça","quarta","quinta","sexta","sábado"]
    let info = /((?<turno>Turno \d+): )?(?<dia>[a-záç]+) das (?<hora>\d+h às \d+h), sala (?<local>.+)/.exec(obj)
    let ano = parseInt(id.replace(/[A-Za-z]+/,''))
    if (info){
      info = info.groups
      info.hora = info.hora.replace("às","-")
      info.dia = dias.findIndex((dia) => dia === info.dia)
      return new WeeklyEvent(nome,info.dia,ano,info.local,info.hora,id,info.turno)
    }
    return 0
  }
  
function createEvents(uc){
    lista = []
    lista.push(extractInfoDatas(new String(uc.datas.teste),"Teste",uc._id))
    lista.push(extractInfoDatas(new String(uc.datas.exame),"Exame",uc._id))
    lista.push(extractInfoDatas(new String(uc.datas.projeto),"Projeto",uc._id))
    for (let i=0;i<uc.hTeoricas.length;i++){
      lista.push(extractInfoAulas(new String(uc.hTeoricas[i]),"Teórica",uc._id))
    }
    for (let i=0;i<uc.hPraticas.length;i++){
      lista.push(extractInfoAulas(new String(uc.hPraticas[i]),"Prática",uc._id))
    }
    return lista.filter( (item) => item !== 0)
}

// Verificar se está sendo executado no Node.js ou no navegador
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        createEvents,
        Event,
        WeeklyEvent
    };
}