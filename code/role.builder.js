var roleBuilder = {

    /** @param {Creep} creep **/
  run: function (creep) {
	    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false
      creep.memory.haveSourse = true
      creep.say('🔄 harvest')
	    }
	    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true
      creep.memory.haveSourse = false
	        creep.say('🚧 build')
	    }

	    if (creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES)
      if (targets.length) {
        let target = creep.pos.findClosestByPath(targets)
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
        }
      }
	    } else {
      if (creep.memory.haveSourse == false) {
        var sources = creep.room.find(FIND_SOURCES)
        creep.memory.source = creep.pos.findClosestByPath(sources).id
        creep.memory.haveSourse = true
      }

      if (creep.harvest(creep.memory.source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}})
      }
	    }
  }
}

module.exports = roleBuilder
