const perlin = {
    rand_vect: function(){
        let theta = Math.random() * 2 * Math.PI;
        return {x: Math.cos(theta), y: Math.sin(theta)};
    },
    dot_prod_grid: function(x, y, vx, vy){
        let g_vect;
        let d_vect = {x: x - vx, y: y - vy};
        if (perlin.gradients[[vx,vy]]){
            g_vect = perlin.gradients[[vx,vy]];
        } else {
            g_vect = perlin.rand_vect();
            perlin.gradients[[vx, vy]] = g_vect;
        }
        return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
    },
    smootherstep: function(x){
        return 6*x**5 - 15*x**4 + 10*x**3;
    },
    interp: function(x, a, b){
        return a + perlin.smootherstep(x) * (b-a);
    },
    seed: function(){
        perlin.gradients = {};
        perlin.memory = {};
    },
    get: function(x, y) {
        if (perlin.memory.hasOwnProperty([x,y]))
            return perlin.memory[[x,y]];
        let xf = Math.floor(x);
        let yf = Math.floor(y);
        //interpolate
        let tl = perlin.dot_prod_grid(x, y, xf,   yf);
        let tr = perlin.dot_prod_grid(x, y, xf+1, yf);
        let bl = perlin.dot_prod_grid(x, y, xf,   yf+1);
        let br = perlin.dot_prod_grid(x, y, xf+1, yf+1);
        let xt = perlin.interp(x-xf, tl, tr);
        let xb = perlin.interp(x-xf, bl, br);
        let v = perlin.interp(y-yf, xt, xb);
        perlin.memory[[x,y]] = v;
        return v;
    }
}
perlin.seed();

export default perlin.get;
