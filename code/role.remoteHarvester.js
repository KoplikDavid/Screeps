var roleRemoteHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
          // var tmpTargets = creep.room.lookForAtArea(FIND_STRUCTURES, 22, 1, 26, 5, true);
          // .filter(
          //   (structure) => {
          //     return (structure.structureType == STRUCTURE_EXTENSION ||
          //         structure.structureType == STRUCTURE_SPAWN ||
          //         structure.structureType == STRUCTURE_TOWER) &&
          //         structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
          //       });

          
          var targets = creep.room.find(FIND_STRUCTURES, {
                  filter: (structure) => {
                      return (structure.structureType == STRUCTURE_EXTENSION ||
                          structure.structureType == STRUCTURE_SPAWN ||
                          structure.structureType == STRUCTURE_TOWER) &&
                          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
              target = creep.pos.findClosestByPath(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleRemoteHarvester;
