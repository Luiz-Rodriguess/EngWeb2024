var Compositor = require('../models/compositores')

// Compositor list
module.exports.compList = () => {
    return Compositor.aggregate([
      {
        $lookup: {
          from: "per", // Nome da coleção 
          localField: "periodo", // Campo na coleção "comp" que corresponde ao período
          foreignField: "_id", // Campo na coleção "per" que corresponde ao id do período
          as: "periodoInfo" // Nome do novo campo que conterá as informações do período
        }
      },
      {
        $unwind: "$periodoInfo" // Desnormaliza o array de informações do período
      },
      {
        $project: {
          _id: 1, 
          nome: 1, 
          bio: 1, 
          dataNasc: 1, 
          dataObito: 1, 
          periodo: "$periodoInfo._id", 
          periodoNome: "$periodoInfo.nome" 
        }
      }
    ])
    .then(resposta => {
      return resposta
    })
    .catch(erro => {
      return erro
    })
}

module.exports.getCompositor = id => {
    return Compositor.aggregate([
        {
            $match:{
                _id:id
            }
        },
        {
          $lookup: {
            from: "per", // Nome da coleção 
            localField: "periodo", // Campo na coleção "comp" que corresponde ao período
            foreignField: "_id", // Campo na coleção "per" que corresponde ao id do período
            as: "periodoInfo" // Nome do novo campo que conterá as informações do período
          }
        },
        {
          $unwind: "$periodoInfo" // Desnormaliza o array de informações do período
        },
        {
          $project: {
            _id: 1, 
            nome: 1, 
            bio: 1, 
            dataNasc: 1, 
            dataObito: 1, 
            periodo: "$periodoInfo._id", 
            periodoNome: "$periodoInfo.nome" 
          }
        }
      ])
      .then(resposta => {
        return resposta[0]
      })
      .catch(erro => {
        return erro
      })
    
}

module.exports.addCompositor = c => {
    return Compositor.create(c)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.updateCompositor = c => {
    return Compositor.updateOne({_id:c._id}, c)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.deleteCompositor = id => {
    return Compositor.deleteOne({_id:id})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.compListPerId = pId =>{
  return Compositor.find({periodo:pId},{_id:1,nome:1})
          .then(resposta =>{
            return resposta
          })
          .catch(erro =>{
            return erro
          })
}