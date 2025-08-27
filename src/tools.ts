export function mergeObjects<A extends object, B extends object>(a: A, b: B): A & B {
    const result = { ...b };
    Object.assign(result, a);
    return result as A & B;
}

export function formatTime(timestamp: string) {
    return new Date(timestamp).toISOString();
}

export function insertChar(str:string,index:number,char:string){
    return str.substring(0,index) + char + str.substring(index);
}

export function getRandomColor() {
  const colors = ['#fff9c4', // 黄色
    '#c8e6c9', // 绿色
    '#bbdefb', // 蓝色
    '#f8bbd0', // 粉色
    '#e1bee7', // 紫色
    '#ffccbc'  // 橙色
  ]
  return colors[Math.floor(Math.random() * colors.length)];
}