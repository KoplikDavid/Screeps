var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRemoteHarvester = require('role.remoteHarvester');
// var rolerepayer = require('role.repayer');

module.exports.initMemory = function () {
  if (!Memory.rooms) {
    Memory.rooms = {};
  }
  for (var spawnName in Game.spawns) {
    var spawn = Game.spawns[spawnName];
    if (!Memory.rooms[spawn.room.name]) {
      Memory.rooms[spawn.room.name] = {
        sources: {}
      };
    }
    var room = spawn.room;
    var sources = room.find(FIND_SOURCES);
    sources.forEach(source => {
      room.memory.sources[source.id] = {
        desiredCreepCount: 2
      };
    });
  }
};

module.exports.loop = function () {
  let workers = {builder: 2, harvester: 2, upgrader: 2, remoteHarvester: 0};
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  var remoteHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteHarvester');
  console.log('remoteHarvesters: ' + remoteHarvesters.length);

  if (remoteHarvesters.length < workers.remoteHarvester) {
    var newName = 'remoteHarvester' + Game.time;
    console.log('Spawning new remoteHarvester: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'remoteHarvester'}});
  }

  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
  console.log('builders: ' + builders.length);

  if (builders.length < workers.builder) {
    var newName = 'builder' + Game.time;
    console.log('Spawning new builder: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'builder'}});
  }

  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  console.log('upgraders: ' + upgraders.length);

  if (upgraders.length < workers.upgrader) {
    var newName = 'upgrader' + Game.time;
    console.log('Spawning new upgrader: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'upgrader'}});
  }

  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  console.log('Harvesters: ' + harvesters.length);

  if (harvesters.length < workers.harvester) {
    var newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], newName,
            {memory: {role: 'harvester'}});
  }

  if (Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
    if (creep.memory.role == 'remoteHarvester') {
      roleRemoteHarvester.run(creep);
    }
    if (creep.memory.role == 'repayer') {
      rolerepayer.run(creep);
    }
  }
  var spawn = Game.spawns['Spawn1'];
  var towers = spawn.room.find(FIND_STRUCTURES, {
    filter: (structure) => structure.structureType == STRUCTURE_TOWER
  });

  for (let tower of towers) {
    console.log(tower);
    if (tower) {
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
      });
      if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower.attack(closestHostile);
      }
    }
  }
};
