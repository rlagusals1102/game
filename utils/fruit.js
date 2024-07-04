import { FRUITS } from './fruits.js';
const { Bodies, World, Composite, Events } = Matter;

export class FruitManager {
  constructor(engine) {
    this._engine = engine;
    this._world = engine.world;
    this._tempFruit = null;
    this._currentFruitIndex = Math.floor(Math.random() * (FRUITS.length - 1)); // Initialize without watermelon
    this._setupCollisionEvents();
  }

  _setupCollisionEvents() {
    Events.on(this._engine, 'collisionStart', (event) => {
      event.pairs.forEach((collisionEvent) => {
        const { bodyA, bodyB } = collisionEvent;
        if (bodyA.render.sprite.texture !== bodyB.render.sprite.texture) return;

        const bodyASpriteNum = this.extractNumbers(bodyA.render.sprite.texture);
        const bodyBSpriteNum = this.extractNumbers(bodyB.render.sprite.texture);

        if (Number(bodyASpriteNum) === 9 && Number(bodyBSpriteNum) === 9) {
          Composite.remove(this._world, bodyA);
          Composite.remove(this._world, bodyB);

          const WATERMELON = {
            name: '/image/10_watermelon',
            radius: 259 / 2,
          };

          const watermelon = Bodies.circle(bodyA.position.x, bodyA.position.y, WATERMELON.radius, {
            render: {
              sprite: { texture: `${WATERMELON.name}.png` },
            },
            restitution: 0.1,
            label: 'fruit',
          });

          World.add(this._world, watermelon);
          return;
        }

        if (bodyASpriteNum === bodyBSpriteNum) {
          Composite.remove(this._world, bodyA);
          Composite.remove(this._world, bodyB);

          const BIGGERFRUITS = FRUITS[Number(bodyASpriteNum) + 1];

          const biggerFruit = Bodies.circle(bodyA.position.x, bodyA.position.y, BIGGERFRUITS.radius, {
            render: {
              sprite: { texture: `${BIGGERFRUITS.name}.png` },
            },
            restitution: 0.1,
            label: 'fruit',
          });

          World.add(this._world, biggerFruit);
        }
      });
    });
  }

  updateTempFruit(x) {
    if (this._tempFruit) {
      Composite.remove(this._world, this._tempFruit);
    }
    const clampedX = this.checkX(x);
    const fruit = FRUITS[this._currentFruitIndex]; 

    this._tempFruit = Bodies.circle(clampedX, 80, fruit.radius, {
      collisionFilter: { group: -1 },
      isSleeping: true,
      render: {
        sprite: { texture: `${fruit.name}.png`, opacity: 0.5 },
      },
      restitution: 0.2,
      label: 'tempFruit',
      isSensor: true,
    });

    World.add(this._world, this._tempFruit);
  }

  addFruit(x) {
    const clampedX = this.checkX(x);
    const fruit = FRUITS[this._currentFruitIndex]; 

    const newFruit = Bodies.circle(clampedX, 80, fruit.radius, {
      render: {
        sprite: { texture: `${fruit.name}.png` },
      },
      restitution: 0,
      label: 'fruit',
    });

    World.add(this._world, newFruit);
    this._currentFruitIndex = Math.floor(Math.random() * (FRUITS.length - 1));
    this.updateTempFruit(clampedX); 
    return newFruit;
  }

  checkX(x) {
    if (x < 47) return 47;
    if (x > 575) return 575;
    return x;
  }

  extractNumbers(str) {
    return str.match(/\d+/g).join('');
  }
}