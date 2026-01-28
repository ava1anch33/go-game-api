import { pos } from "../utils/index.js"

class AnalystService {
    SIZE = 19
    TOTAL = 361

    reflect(v) {
        if (v < 0) return -v
        if (v >= this.SIZE) return this.SIZE * 2 - v - 2
        return v
    }

    async givenBoardAnalyst(passBoard) {
        const board = Int8Array.from(passBoard);
        const influence = this.expandInfluence(board);
        return { influence };
    }

    expandInfluence(board) {
        const influence = new Int8Array(this.TOTAL)

        for (let i = 0; i < this.TOTAL; i++) {
            const stone = board[i]
            if (stone === 0) continue

            const base = stone === 1 ? 64 : -64
            const x0 = i % this.SIZE
            const y0 = Math.floor(i / this.SIZE)

            for (let dx = -6; dx <= 6; dx++) {
                for (let dy = -6; dy <= 6; dy++) {
                    const dist = Math.abs(dx) + Math.abs(dy)
                    if (dist > 6) continue


                    const value = Math.floor(Math.abs(base) / (1 << dist))
                    if (value === 0) continue


                    const x = this.reflect(x0 + dx)
                    const y = this.reflect(y0 + dy)
                    const sign = base > 0 ? 1 : -1


                    influence[pos(x, y)] += sign * value
                }
            }
        }

        const result = new Int8Array(this.TOTAL)
        for (let i = 0; i < this.TOTAL; i++) {
            if (influence[i] > 0) result[i] = 1
            else if (influence[i] < 0) result[i] = 2
        }
        return result
    }
}

export const analystService = new AnalystService()