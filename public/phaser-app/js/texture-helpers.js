/**
 * Helper class for creating simple textures, to avoid using Phaser.Graphics, and not make code duplications.
 */
class TextureHelpers {
	/**
	 * Create temporary Phaser.Graphics, draw rect with given fill color, make texture fom it, and destroy graphics.
	 * @param {Phaser.Scene} scene - scene for Graphics creation. Graphics not added to the scene graph. 
	 * @param {string} textureName - unique name of texture to create.
	 * @param {number} color - fill color value in 0x000000 format.
	 * @param {number} width - width of texture in pixels. 2 by default.
	 * @param {number} height - height of texure in pixels. 2 by default.
	 * @public
	 */
	static createRectTexture(scene, textureName, color, width = 2, height = 2) {
		let graphics = scene.make.graphics({ fillStyle: { color: color }});
		graphics.fillRect(0, 0, width, height);
		graphics.generateTexture(textureName, width, height);
		graphics.destroy();
	}
}