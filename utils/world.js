const { Bodies, World, Composite } = Matter

export class WorldManager {
  constructor(world) {
    this._world = world
    this.OVERLINE_Y = 150
    this._setupWalls()
    this._setupOverLine()
  }

  _setupWalls() {
    const walls = [
      Bodies.rectangle(15, 395, 30, 790, {
        isStatic: true,
        render: { fillStyle: '#E6B143' },
      }),
      Bodies.rectangle(605, 395, 30, 790, {
        isStatic: true,
        render: { fillStyle: '#E6B143' },
      }),
      Bodies.rectangle(310, 820, 620, 60, {
        isStatic: true,
        render: { fillStyle: '#E6B143' },
      }),
    ]
    World.add(this._world, walls)
  }

  _setupOverLine() {
    const overLine = Bodies.rectangle(310, this.OVERLINE_Y, 620, 2, {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: '#ff2400' },
    })
    World.add(this._world, overLine)
  }

  isAnyFruitAboveOverLine() {
    const bodies = Composite.allBodies(this._world)
    for (let body of bodies) {
      if (body.label === 'fruit' && body.position.y < this.OVERLINE_Y) {
        return true
      }
    }
    return false
  }
}
