import{$ as e,B as t,Ft as n,H as r,It as i,Pn as a,Q as ee,Un as o,Wn as te,a as s,gr as c,ht as l,nr as u,o as d,yt as f}from"./three.core-BqsHPrKr.js";import{n as ne,t as re}from"./OrbitControls-CceyuQ92.js";var ie=[`phong`,`phong1`,`toon`,`normals`,`interlaced`,`wireframe`],p=l.degToRad,ae=24,m=24/5,h=m*3,g=22,_=`
out vec3 FragPos;
out vec3 Normal;
out vec3 ObjNormal;
out vec2 TexCoord;
void main() {
  FragPos = vec3(modelMatrix * vec4(position, 1.0)); // world space position
  Normal = normalize(mat3(transpose(inverse(modelMatrix))) * normal); // correct normal transformation
  ObjNormal = normal;
  TexCoord = uv;
  gl_Position = projectionMatrix * viewMatrix * vec4(FragPos, 1.0);
}
`,v=`
in vec3 FragPos;
in vec3 Normal;
in vec3 ObjNormal;
in vec2 TexCoord;

struct Light { vec3 position; vec3 ambient; vec3 diffuse; vec3 specular; };
struct Spotlight { vec3 position; vec3 direction; float cutOff; float outerCutOff; vec3 ambient; vec3 diffuse; vec3 specular; };

uniform int uMode;
uniform bool unlit;
uniform bool hasMap;
uniform sampler2D map;
uniform vec3 matDiffuse;
uniform vec3 matAmbient;
uniform vec3 matSpecular;
uniform float opacity;
uniform vec3 viewPos;
uniform Light lights[1];
uniform Spotlight spotlights[${g}];
uniform bool useCarSpotlights;

out vec4 FragColor;

void main() {
  vec3 baseColor = hasMap ? texture(map, TexCoord).rgb : matDiffuse;
  if (unlit) { FragColor = vec4(baseColor, 1.0); return; } // the sky

  // v.txt / f.txt: the normal as a colour (and the wireframe of assignment 1)
  if (uMode == 3 || uMode == 5) { FragColor = vec4(ObjNormal, 1.0); return; }

  // InterlacedFragShader.glsl: every other pair of lines
  if (uMode == 4) {
    int y = int(gl_FragCoord.y) / 2;
    FragColor = (y % 2 == 0) ? vec4(ObjNormal, 1.0) + vec4(1.0, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  vec3 norm = normalize(Normal);
  vec3 viewDir = normalize(viewPos - FragPos);
  vec3 L = normalize(lights[0].position - FragPos);

  // ph_f.txt: Phong with one light
  if (uMode == 1) {
    vec3 R = reflect(-L, norm);
    float diff = max(dot(norm, L), 0.0);
    float spec = pow(max(dot(R, viewDir), 0.0), 32.0);
    vec3 result = lights[0].ambient * baseColor + lights[0].diffuse * baseColor * diff + lights[0].specular * matSpecular * spec;
    FragColor = vec4(clamp(result, 0.0, 1.0), opacity);
    return;
  }

  // cartoon_f.txt: the light in five steps
  if (uMode == 2) {
    float intensity = max(dot(norm, L), 0.0);
    if (intensity > 0.95) intensity = 1.0;
    else if (intensity > 0.75) intensity = 0.8;
    else if (intensity > 0.5) intensity = 0.6;
    else if (intensity > 0.25) intensity = 0.4;
    else intensity = 0.2;
    FragColor = vec4(lights[0].ambient * baseColor + lights[0].diffuse * baseColor * intensity, opacity);
    return;
  }

  // new_shading_fragment2.glsl: every light and every spotlight
  float shininess = 64.0;
  vec3 result = vec3(0.0);
  {
    vec3 ambient = lights[0].ambient * matAmbient * baseColor;
    float diff = max(dot(norm, L), 0.0);
    vec3 diffuse = lights[0].diffuse * diff * baseColor;
    vec3 R = reflect(-L, norm);
    float spec = pow(max(dot(viewDir, R), 0.0), shininess);
    vec3 specular = lights[0].specular * spec * matSpecular;
    result += ambient + diffuse + specular;
  }
  for (int i = 0; i < ${g}; i++) {
    if (!(!useCarSpotlights && (i == 0 || i == 1))) {
      Spotlight S = spotlights[i];
      vec3 lightDir = normalize(S.position - FragPos);
      float theta = dot(lightDir, normalize(-S.direction));
      float epsilon = S.cutOff - S.outerCutOff;
      float intensity = clamp((theta - S.outerCutOff) / epsilon, 0.0, 1.0);
      if (theta > S.outerCutOff) {
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = S.diffuse * diff * baseColor;
        vec3 reflectDir = reflect(-lightDir, norm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
        vec3 specular = S.specular * spec * matSpecular;
        result += (diffuse + specular) * intensity;
      }
    }
  }
  FragColor = vec4(clamp(result, 0.0, 1.0), opacity);
}
`;async function y(l,g,y){let b=await(await fetch(`${g}scene.json`)).json(),oe=Object.fromEntries(await Promise.all(Object.entries(b).map(async([e,t])=>[e,await(await fetch(g+t.file)).arrayBuffer()]))),x=new ne({antialias:!0});x.setPixelRatio(Math.min(window.devicePixelRatio,2)),x.setSize(l.clientWidth,l.clientHeight),x.setClearColor(0),l.appendChild(x.domElement);let S=new o,se={position:new c(-20,10,10),ambient:new c(.32,.32,.36),diffuse:new c(.55,.55,.6),specular:new c(.6,.6,.6)},C=(e,t,n,r,i,a)=>({position:new c(...e),direction:new c(...t).normalize(),cutOff:Math.cos(p(n)),outerCutOff:Math.cos(p(r)),ambient:new c(.1,.1,.1),diffuse:new c(...i),specular:new c(...a)}),w=[C([-.85,-1,-4.6],[0,-.5,-1],15,25,[.8,.8,.8],[.8,.8,.8]),C([.83,-1,-4.6],[0,-.5,-1],15,25,[.8,.8,.8],[.8,.8,.8])],T=[],E=[];for(let e=0;e<10;e++)T.push(C([-4,2,-e*24],[0,-1,0],0,25,[.8,.8,.4],[.8,.8,0])),E.push(-e*24),T.push(C([0,2,-5-e*24],[0,-1,0],0,25,[.8,.8,.4],[.8,.8,0])),E.push(-5-e*24);let D={uMode:{value:0},viewPos:{value:new c},lights:{value:[se]},spotlights:{value:[...w,...T]},useCarSpotlights:{value:!0}},ce=new u,O=[...new Set(Object.values(b).flatMap(e=>e.parts.map(e=>e.map).filter(e=>!!e)))],k=new Map(await Promise.all(O.map(async e=>{let t=await ce.loadAsync(g+e);return t.colorSpace=``,t.wrapS=t.wrapT=a,t.anisotropy=4,[e,t]}))),A=e=>k.get(e),j=[],M=(n,i=!1)=>{let a=b[n],o=oe[n],l=new r;for(let n of a.parts){let r=new d;r.setAttribute(`position`,new s(new Float32Array(o,n.offset,n.vertices*3),3)),r.setAttribute(`normal`,new e(new ee(new Int8Array(o,n.offset+n.vertices*12,n.vertices*4),4),3,0,!0)),r.setAttribute(`uv`,new s(new Float32Array(o,n.offset+n.vertices*16,n.vertices*2),2)),r.setIndex(new s(n.index32?new Uint32Array(o,n.indexOffset,n.indices):new Uint16Array(o,n.indexOffset,n.indices),1));let a=new te({glslVersion:t,vertexShader:_,fragmentShader:v,uniforms:{...D,unlit:{value:i},hasMap:{value:!!n.map},map:{value:n.map?A(n.map):null},matDiffuse:{value:new c(...n.Kd)},matAmbient:{value:new c(...n.Ka)},matSpecular:{value:new c(...n.Ks)},opacity:{value:n.d}},transparent:n.d<1,side:2,depthWrite:!i&&n.d>=1});j.push(a),l.add(new f(r,a))}return l},N=(e,t,n,r)=>(e.position.set(t[0],t[1],t[2]),e.rotation.set(p(n[0]),p(n[1]),p(n[2]),`ZYX`),e.scale.setScalar(r),e),P=N(M(`cadillac`),[0,-2,-2],[-90,0,0],1),F=N(M(`sky`,!0),[0,0,0],[0,190,0],1e3),I=N(M(`desert`),[0,-2.1,0],[0,0,0],10),L=new r,R=M(`road`),z=M(`lamp`);for(let e=0;e<10;e++)L.add(N(R.clone(),[-2,-2,-10-e*24],[0,0,0],1)),L.add(N(z.clone(),[-5.85,0,-e*24],[0,180,0],1)),L.add(N(z.clone(),[1.85,0,-5-e*24],[0,0,0],1));S.add(F,I,L,P);let B=new i(60,l.clientWidth/l.clientHeight,1,1e4),V=new n(-20,20,10,-10,1,1e4),H=!1,U=`third`,W=new re(B,x.domElement);W.enabled=!1,W.enableDamping=!0,W.maxDistance=60;let G=0,K=0,q=m,J=0,Y=0,X=0,Z=performance.now(),le=e=>{U===`third`?(e.position.set(G,0,5),e.rotation.set(0,0,0,`XYZ`)):U===`first`&&(e.position.set(G,0,0),e.rotation.set(0,0,p(-1),`XYZ`))},Q=e=>{X=requestAnimationFrame(Q);let t=Math.min(.05,(e-Z)/1e3);Z=e,q=Math.max(0,Math.min(h,q+J*m*t)),Y=(Y+q*t)%ae,L.position.z=Y,T.forEach((e,t)=>e.position.z=E[t]+Y),G=Math.max(-4.8,Math.min(.85,G+K*t*(2+q*.35)));let n=-K*.12*Math.min(1,q/m);P.rotation.set(p(-90),P.rotation.y+(n-P.rotation.y)*Math.min(1,t*8),0,`ZYX`),P.position.x=G,w[0].position.x=-.85+G,w[1].position.x=.83+G,w.forEach(e=>e.direction.set(Math.sin(-P.rotation.y),-.5,-1).normalize()),U===`free`?(W.target.set(G,-1.3,-2.4),W.update()):le(B);let r=H?V:B;H&&(V.position.copy(B.position),V.quaternion.copy(B.quaternion)),D.viewPos.value.copy(r.position),x.render(S,r)},$=new ResizeObserver(()=>{let e=l.clientWidth,t=l.clientHeight;!e||!t||(x.setSize(e,t),B.aspect=e/t,B.updateProjectionMatrix())});return $.observe(l),y(),X=requestAnimationFrame(Q),{setView:e=>{U=e,W.enabled=e===`free`,e===`free`&&(B.position.set(G+7,2.5,4),W.update())},setOrtho:e=>{H=e},setMode:e=>{D.uMode.value=ie.indexOf(e);for(let t of j)t.wireframe=e===`wireframe`&&!t.uniforms.unlit.value},setHeadlights:e=>{D.useCarSpotlights.value=e},steer:e=>{K=e},throttle:e=>{J=e},speed:()=>q,dispose:()=>{cancelAnimationFrame(X),$.disconnect(),W.dispose(),S.traverse(e=>{e instanceof f&&e.geometry.dispose()}),j.forEach(e=>e.dispose()),k.forEach(e=>e.dispose()),x.dispose(),x.domElement.remove()}}}export{y as createDriveScene};