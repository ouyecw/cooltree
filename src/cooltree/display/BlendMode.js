
/**
 * @class
 * @module BlendMode
 */
export default class BlendMode {}
BlendMode.className="BlendMode";

/**
 * @static
 * 新图形绘制于已有图形的顶部。这是默认的行为。
 */
BlendMode.SOURCE_OVER = "source-over";

/**
 * @static
 * 只有在新图形和已有内容重叠的地方，才绘制新图形。
 */
BlendMode.SOURCE_ATOP = "source-atop";

/**
 * @static
 * 在新图形以及已有内容重叠的地方，新图形才绘制。所有其他内容成为透明。
 */
BlendMode.SOURCE_IN = "source-in";

/**
 * @static
 * 只有在和已有图形不重叠的地方，才绘制新图形。
 */
BlendMode.SOURCE_OUT = "source-out";

/**
 * @static
 * 新图形绘制于已有内容的后面。
 */
BlendMode.DESTINATION_OVER = "destination-over";

/**
 * @static
 * 已有的内容只有在它和新的图形重叠的地方保留。新图形绘制于内容之后。
 */
BlendMode.DESTINATION_ATOP = "destination-atop";

/**
 * @static
 * 在新图形以及已有画布重叠的地方，已有内容都保留。所有其他内容成为透明的。
 */
BlendMode.DESTINATION_IN = "destination-in";

/**
 * @static
 * 在已有内容和新图形不重叠的地方，已有内容保留。所有其他内容成为透明。
 */
BlendMode.DESTINATION_OUT = "destination-out";

/**
 * @static
 * 在图形重叠的地方，颜色由两种颜色值的加值来决定。
 */
BlendMode.LIGHTER = "lighter";

/**
 * @static
 * 在图形重叠的地方，其颜色由两个颜色值相减后决定
 */
BlendMode.DARKER = "darker";

/**
 * @static
 * 只绘制新图形，删除其他所有内容。
 */
BlendMode.COPY = "copy";

/**
 * @static
 * 在重叠和正常绘制的其他地方，图形都成为透明的。
 */
BlendMode.XOR = "xor";

/**
 * @static
 * 不使用混合模式。
 */
BlendMode.NONE = null;
